import List from './List.component';
import ListComposition, { hooks } from './ListComposition'
import Toolbar from './Toolbar';

ListComposition.hooks = hooks;

List.ListComposition = ListComposition;

List.Toolbar = Toolbar;

export default List;
