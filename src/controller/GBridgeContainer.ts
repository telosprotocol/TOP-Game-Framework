import {
  close_bridge,
  setStatusColor_bridge,
} from '../js_bridge/js_call_app_base';
import { safePerformanceTimeNow } from '../utils/datetime';
import { tryTraceEvent } from '../utils/trace';
import GBridgeBase, { ICallMsgBase } from './GBridgeBase';
import {
  showLoading_bridge,
  dismissLoading_bridge,
} from '../js_bridge/js_call_app_base';

// const TAG = "GBRIDGE_CONTAINER"

// type ICallMsg<TInput, TReturn> = {
//   //  id
//   callId: string;
//   data: TInput;
//   /**
//    *  callback,
//    */
//   callback?: (returnData: TReturn) => void;

// }
export class GBridgeContainer extends GBridgeBase {
  protected logName = '[GBridge-Container]';
  protected debug = true;

  private static _Instance: GBridgeContainer;
  static get Instance() {
    if (!GBridgeContainer._Instance) {
      GBridgeContainer._Instance = new GBridgeContainer();
    }
    return GBridgeContainer._Instance;
  }

  //#region for container
  private _iframeList: HTMLIFrameElement[] = [];
  register(iframe: HTMLIFrameElement) {
    this._iframeList.push(iframe);
  }

  unregister(iframe?: HTMLIFrameElement) {
    if (!iframe) {
      this._iframeList = [];
      return;
    }
    for (let i = 0; i < this._iframeList.length; i++) {
      if (this._iframeList[i] === iframe) {
        this._iframeList.splice(i, 1);
      }
    }
  }

  //#endregion

  private _startDt = 0;
  init() {
    this.clearListeners();
    const startDt = safePerformanceTimeNow();
    this._startDt = startDt;
    super.init();
    // trace
    this.addEventHandler<
      {
        eventName: string;
        props: {
          [key: string]: string | number;
        };
        labelValue?: { label: string; value: number | string };
      },
      void
    >('trace', (data) => {
      tryTraceEvent(
        data.eventName,
        { ...data.props, ...data.labelValue },
        true
      );
    });

    // setStatusColor
    this.addEventHandler<{ color: string; isDark: boolean }, boolean>(
      'setStatusColor',
      (data) => {
        return setStatusColor_bridge(data);
      }
    );

    // setStatusColor
    this.addEventHandler<{ color: string }, boolean>('close', () => {
      return close_bridge();
    });

    this.addEventHandler('showLoading', () => {
      showLoading_bridge();
    });

    this.addEventHandler('hideLoading', () => {
      dismissLoading_bridge();
    });

    /**
     *
     */
    this.addEventHandler<
      {
        gameName: string;
        score?: number;
        level?: number;
      },
      void
    >('pushGameData', (data) => {
      const labelValue = {
        label: data.level != null ? 'level' : 'score',
        value: data.level || data.score,
      };
      tryTraceEvent('game_score', {
        ...data,
        ...labelValue,
      });
    });

    let lastDt = startDt;

    /**
     *
     */
    this.addEventHandler<
      {
        stage: string;
        gameName: string;
        isOk: boolean;
      },
      void
    >('onGameProcess', (data) => {
      const dtNow = safePerformanceTimeNow();

      const stage = data.stage + (data.isOk ? '' : '_error');
      const stageMS = dtNow - lastDt;
      const totalMs = dtNow - startDt;

      tryTraceEvent('game_process', {
        gameName: data.gameName,
        stage,
        totalMS: dtNow - startDt,
        stageMS,
      });
      lastDt = dtNow;
      this.stageProcess.gameName = data.gameName;
      this.stageProcess[stage] = stageMS;
      this.stageProcess.stageTotal = totalMs;
      if (data.isOk) {
        (this.stageProcess.okStageCnt as number)++;
      } else {
        (this.stageProcess.errorCnt as number)++;
      }
    });
  }

  private stageProcess: { [key: string]: string | number } = {
    gameName: '',
    stageTotal: 0,
    okStageCnt: 0,
    errorCnt: 0,
  };

  getGameTraceData() {
    const dtNow = safePerformanceTimeNow();
    return {
      ...this.stageProcess,
      total: dtNow - this._startDt,
    };
  }

  destroy() {
    try {
      GBridgeContainer.Instance._iframeList.forEach((iframe) => {
        (iframe as any)['document'].write('');
        (iframe as any)['document'].clear();
      });
    } catch (e) {}
    this._iframeList = [];
    super.destroy();
    this.unregister();
  }
  /**
   * container call iframe
   */
  callClient<TInput, TReturnData>(
    msg: ICallMsgBase<TInput, TReturnData>,
    _iframe?: HTMLIFrameElement
  ) {
    const iframeList = _iframe ? [_iframe] : this._iframeList;
    const winList = iframeList.map((ifr) => {
      return ifr.contentWindow;
    });
    this.callMethod(msg, winList);
  }
}
