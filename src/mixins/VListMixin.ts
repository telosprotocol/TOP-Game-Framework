import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import { List } from 'vant';
import Component from 'vue-class-component';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { AsyncStatus, List },
})
export default class VListMixin<TRecord> extends Vue {
  // /**
  //  *
  //  */
  // get firstPageStatus() {
  //   const status = this.asyncStatus;
  //   if (status === 'loading') {
  //     if (this.rawDataList?.length > 0) {
  //       return '';
  //     }
  //   }
  //   return status;
  // }

  get asyncStatus() {
    if (this.listRawStates.loading) {
      return 'loading';
    } else if (this.listRawStates.error) {
      return 'error';
    } else if (this.listRawStates.finished) {
      if (!this.rawDataList?.length) {
        return 'nodata';
      }
    }
    return '';
  }

  /**
   *      loading、error
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  noStatus: boolean;

  /**
   * v-bind="listBinds"
   */
  get listBinds() {
    return {
      loading: this.listRawStates.loading,
      finished: this.listRawStates.finished,
      errorText: this.listRawStates.errorText || this.$t('Base.FailLoad'),
      error: this.listRawStates.error,
      class: this.noStatus ? ' van-list--nostatus' : '',
    };
  }

  /**
   * v-on="listListeners"
   */
  get listListeners() {
    return {
      'update:error': (error: boolean) => {
        this.listRawStates.error = error;
      },
      input: (v: boolean) => {
        this.listRawStates.loading = v;
      },
      load: this.onListLoad,
    };
  }

  listRawStates = {
    loading: false,
    finished: false,
    error: false,
    errorText: '',
    pageIndex: 1,
  };
  get listQueryObj() {
    return {
      pageIndex: this.listRawStates.pageIndex,
      pageSize: this.pageSize,
    };
  }

  get pageSize() {
    return 12;
  }
  rawDataList: TRecord[] = [];
  resetListLoad() {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[LIST] resetLoad');
    }
    this.listRawStates.pageIndex = 1;
    this.rawDataList = [];
    this.listRawStates.finished = false;
  }

  protected onReqStart(_from?: string) {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log(
        '[LIST] ReqStart',

        'from:',
        _from,
        'pageIndex:',
        this.listRawStates.pageIndex
      );
    }
    this.listRawStates.loading = true;
  }

  protected onReqEnd(
    res: IHttpVResponse<TRecord[]>,
    queryObj: API.UserPropPageAO
  ) {
    if (res.success) {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log(
          '[LIST] ReqEnd',
          'pageIndex:',
          this.listRawStates.pageIndex,
          'hasNext:',
          res.total > queryObj.pageIndex * queryObj.pageSize,
          'total',
          res.total
        );
      }
      const hasNext = res.total > queryObj.pageIndex * queryObj.pageSize;
      this.listRawStates.finished = !hasNext;
      this.rawDataList = this.rawDataList.concat(res.data || []);
      this.listRawStates.pageIndex++;
      this.listRawStates.loading = false;
      this.listRawStates.error = false;
    } else {
      this.listRawStates.loading = false;
      this.listRawStates.error = true;
      this.listRawStates.errorText = res.message;
    }
  }

  /**
   *      (   )
   * @param from
   */
  onListLoad(_from?: 'error') {
    // this.onReqStart();
    throw new Error('Impl');
    // this.onReqEnd(res)
  }
}
