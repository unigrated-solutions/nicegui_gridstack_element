// gridstack.js
export default {
  template: `<div ref="root" class="grid-stack" style="height:100%; width:100%;"></div>`,

  props: {
    options: { type: Object, default: () => ({}) },
  },

  data() {
    return { grid: null, counter: 0, isStatic: false };
  },

  mounted() {
    if (!window.GridStack) {
      console.error('GridStack missing: load gridstack-all.js in <head>');
      return;
    }

    // defaults, then user overrides (change order if you want to force defaults)
    this.grid = window.GridStack.init({
      column: 30,
      margin: 8,
      cellHeight: 80,
      float: true,
      draggable: { handle: ".widget-header" },
      resizable: { handles: "all" },
      ...this.options,
    }, this.$refs.root);

    this.grid.on('change', (event, items) => this.$emit('changed', items));
  },

  methods: {

    findSpotNoReflow(w, h, preferred = { x: 0, y: 0 }) {
      const grid = this.grid;
      const cols = grid.getColumn();

      if (grid.isAreaEmpty(preferred.x, preferred.y, w, h)) {
        return { x: preferred.x, y: preferred.y };
      }

      const nodes = grid.engine?.nodes || [];
      const usedBottom = nodes.reduce((m, n) => Math.max(m, (n.y ?? 0) + (n.h ?? 0)), 0);
      const maxY = Math.max(usedBottom, 0);

      for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x <= cols - w; x++) {
          if (grid.isAreaEmpty(x, y, w, h)) { 
            return { x, y };
          }
        }
      }

      for (let y = usedBottom; ; y++) {
        for (let x = 0; x <= cols - w; x++) {
          if (grid.isAreaEmpty(x, y, w, h)) { 
            return { x, y };
          }
        }
      }
    },

    add_widget(title='Widget', x=0, y=0, w=6, h=2) {
      if (!this.grid) return;

      const id = ++this.counter;

      const pos = this.findSpotNoReflow(w, h, { x, y });
      x = pos.x; y = pos.y;

      const item = document.createElement('div');
      item.className = 'grid-stack-item';
      item.setAttribute('gs-x', String(x));
      item.setAttribute('gs-y', String(y));
      item.setAttribute('gs-w', String(w));
      item.setAttribute('gs-h', String(h));

      item.innerHTML = `
        <div class="grid-stack-item-content">
          <div class="widget-header">
            <span>${title} #${id}</span>
            <button type="button" data-gs-close="1"
              style="border:0;background:transparent;cursor:pointer;font-size:16px;line-height:1;">×</button>
          </div>
          <div class="widget-body">Drag by the header. Resize from edges/corners.</div>
        </div>
      `;

      this.$refs.root.appendChild(item);
      this.grid.makeWidget(item);

      item.querySelector('[data-gs-close="1"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.grid.removeWidget(item);
      });

      return id;
    },

    remove_all() { this.grid?.removeAll(); },
    save_layout() { return this.grid?.save(false, true) ?? []; },

    toggle_static() {
      this.isStatic = !this.isStatic;
      this.grid?.setStatic(this.isStatic);
      return this.isStatic;
    },
  },
};
