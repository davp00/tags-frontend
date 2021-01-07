import StoreWorker from '../assets/js/store.worker';
import { state, mutations, actions } from './opts';
import { wrap } from '~/util/worker.lib';

export default () => {
  return wrap(
    { state, mutations, actions },
    // @ts-ignore
    new StoreWorker()
  );
};
