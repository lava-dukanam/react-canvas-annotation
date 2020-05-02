import { EditorData } from 'interfaces/EditorData';
import { CursorType } from 'interfaces/enums/CursorType';
import { EventType } from 'interfaces/enums/EventType';
import { IPoint } from 'interfaces/IPoint';
import { ViewPortActions } from 'logic/actions/ViewPortActions';
import { EditorModel } from 'staticModels/EditorModel';
import { store } from 'store';
import { updateCustomCursorStyle } from 'store/general/actionCreators';
import { MouseEventUtil } from 'utils/MouseEventUtil';
import { PointUtil } from 'utils/PointUtil';

export class ViewPortHelper {
  private startScrollPosition: IPoint;
  private mouseStartPosition: IPoint;

  public update(data: EditorData): void {
    if (!!data.event) {
      switch (MouseEventUtil.getEventType(data.event)) {
        case EventType.MOUSE_MOVE:
          this.mouseMoveHandler(data);
          break;
        case EventType.MOUSE_UP:
          this.mouseUpHandler(data);
          break;
        case EventType.MOUSE_DOWN:
          this.mouseDownHandler(data);
          break;
        default:
          break;
      }
    }
  }

  private mouseDownHandler(data: EditorData) {
    const event = data.event as MouseEvent;
    this.startScrollPosition = data.absoluteViewPortContentScrollPosition;
    this.mouseStartPosition = { x: event.screenX, y: event.screenY };

    store.dispatch(updateCustomCursorStyle(CursorType.GRABBING));
    EditorModel.canvas.style.cursor = 'none';
  }

  private mouseUpHandler(data: EditorData) {
    this.startScrollPosition = null;
    this.mouseStartPosition = null;
    store.dispatch(updateCustomCursorStyle(CursorType.GRAB));
    EditorModel.canvas.style.cursor = 'none';
  }

  private mouseMoveHandler(data: EditorData) {
    if (!!this.startScrollPosition && !!this.mouseStartPosition) {
      const event = data.event as MouseEvent;
      const currentMousePosition: IPoint = { x: event.screenX, y: event.screenY };
      const mousePositionDelta: IPoint = PointUtil.subtract(
        currentMousePosition,
        this.mouseStartPosition,
      );
      const nextScrollPosition = PointUtil.subtract(this.startScrollPosition, mousePositionDelta);
      ViewPortActions.setScrollPosition(nextScrollPosition);
      store.dispatch(updateCustomCursorStyle(CursorType.GRABBING));
    } else {
      store.dispatch(updateCustomCursorStyle(CursorType.GRAB));
    }
    EditorModel.canvas.style.cursor = 'none';
  }
}
