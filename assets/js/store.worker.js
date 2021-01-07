import { state, mutations, actions } from '@/store/opts';
import { expose } from '@/util/worker.lib';

expose({ state, mutations, actions });

export default {};
