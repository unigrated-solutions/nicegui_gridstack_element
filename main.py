# main.py
from nicegui import ui
from gridstack.gridstack import GridStack

@ui.page('/')
def page():
    ui.query('.nicegui-content').classes('p-0')
    with ui.column().classes('w-full'):
        grid = GridStack().classes('h-full')


    with ui.footer(elevated=True).classes('p-0 m-0').style('height:40px;'):
        with ui.row().classes('h-full items-center gap-2 px-2'):
            ui.button('Add', on_click=lambda: grid.add_widget('Widget')).props('dense draggable')
            ui.button('Clear', on_click=grid.remove_all).props('dense')

ui.run()
