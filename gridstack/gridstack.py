# gridstack.py 
from pathlib import Path
from typing import Any, Callable, Optional

from nicegui import ui
from nicegui.element import Element

GRIDSTACK_VER = "12.4.2"

_assets_loaded = False
_css_loaded = False

def _ensure_assets() -> None:
    global _assets_loaded
    if _assets_loaded:
        return

    ui.add_head_html(
        f"""
        <link rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/gridstack@{GRIDSTACK_VER}/dist/gridstack.min.css">
        <script src="https://cdn.jsdelivr.net/npm/gridstack@{GRIDSTACK_VER}/dist/gridstack-all.js"></script>
        """,
        shared=True,
    )
    _assets_loaded = True


def _ensure_css() -> None:
    global _css_loaded
    if _css_loaded:
        return

    ui.add_css(Path(__file__).with_name("gridstack.css").read_text(encoding="utf-8"))
    _css_loaded = True


class GridStack(Element, component="gridstack.js"):
    def __init__(
        self,
        *,
        options: Optional[dict[str, Any]] = None,
        on_changed: Optional[Callable] = None,
    ) -> None:
        _ensure_assets()
        _ensure_css()
        super().__init__()

        if options is not None:
            self.props["options"] = options
        if on_changed is not None:
            self.on("changed", on_changed)

    def add_widget(self, title: str = "Widget", x: int = 0, y: int = 0, w: int = 3, h: int = 2) -> None:
        self.run_method("add_widget", title, x, y, w, h)

    def remove_all(self) -> None:
        self.run_method("remove_all")

    def toggle_static(self) -> None:
        self.run_method("toggle_static")

    async def save_layout(self):
        return await self.run_method("save_layout")
