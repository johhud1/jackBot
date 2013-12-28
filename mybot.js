
function findNearestFruitInTypes(types){
	trace("searching for nearest fruits of type " + types);
	var board = get_board();
	var nearestDist = 9999999;
	var nx = -1;
	var ny = -1;
	for(var x = 0; x<WIDTH; x++){
		for(var y = 0; y<HEIGHT; y++){
			if(board[x][y] > 0){
				//if there is a fruit at this location, check if its one of the types we are interested in
				for(var i=0; i<types.length; i++){
					if(board[x][y] == types[i]){
						var dist = Math.abs(x - get_my_x()) + Math.abs(y - get_my_y());
						if(dist < nearestDist){
							nearestDist = dist;
							nx = x; ny = y;
						}
					}
				}
			}
		}
	}
	return [nx, ny];
}

var sortedFruitTypeList;
var majorityFruitNums = [];

function new_game() {
	for(var c = 1; c <= get_number_of_item_types(); c++){
		majorityFruitNums[c] = Math.floor(get_total_item_count(c)/2)+1;
		trace("need " + majorityFruitNums[c]  + " of type " + c  + " to win");
	}
	//test1();
}

var explored_paths = 0;

function computeMajorityFruitNums(){
	for(var c = 1; c <= get_number_of_item_types(); c++){
		majorityFruitNums[c] = Math.floor(get_total_item_count(c)/2)+1;
		trace("need " + majorityFruitNums[c]  + " of type " + c  + " to win");
	}
}
function all_fruits_list(){
	var rlist = [];
	for(var i = 0; i<= get_number_of_item_types(); i++){
		rlist.push(i);
	}
	return rlist;
}
//returns all fruit types that I don't already have a majority in and 
//where it's still possible to obtain a majority from fruits on the board
function all_non_majority_fruits(){
	trace("finding all non majority fruits");
	var rlist = [];
	for(var i = 0; i<= get_number_of_item_types(); i++){
		var maj = get_total_item_count(i)/2;
		var remainingFruits = get_total_item_count(i) - (get_opponent_item_count(i) + get_my_item_count(i));
		if(Math.ceil(maj) > get_my_item_count(i) && (remainingFruits >= maj - get_my_item_count(i))){
			rlist.push(i);
		}
	}
	return rlist;
}

function all_fruits(){
	var rlist = [];
	for(var i = 0; i<= get_number_of_item_types(); i++){
		rlist.push(i);
	}
	return rlist;
}
//given a fruit type: i, returns the number left on the board of that type
function get_remaining_fruit(i){
	var remainingFruits = get_total_item_count(i) - (get_opponent_item_count(i) + get_my_item_count(i));
	return remainingFruits;
}
//should also return fruit types that we can still get a tie for.
function findRemainingMajorityFruits(){	
	var rlist = [];
	var fTypes = get_number_of_item_types();
	var majTypes = Math.floor(fTypes/2)+1;
	var remainingMajTypes = majTypes;
	for (var i = 0; i<fTypes; i++){
		var maj = Math.floor(get_total_item_count(i)/2)+1;
		if(maj <= get_my_item_count(i)){
			//we have a majority for this type
			remainingMajTypes--;
		}
	}
	for(var i = 0; i<= get_number_of_item_types(); i++){ // && (rlist.length < remainingMajTypes); i++){
		var half = get_total_item_count(i);
		var remainingFruits = get_total_item_count(i) - (get_opponent_item_count(i) + get_my_item_count(i));
		if(half > get_my_item_count(i) && (remainingFruits > half - get_my_item_count(i))){
			rlist.push(i);
		}
	}
	return rlist;
}
function fruit_comparison(a, b){
	if(a.dist < b.dist){
		return 1;
	}
	if(a.dist > b.dist){
		return -1;
	}
	return 0;
}
//takes a list of position objects, returns the nearest position object
function find_nearest_pos_in_set(position_set){
	trace("finding nearest position in set " + JSON.stringify(position_set));
	var nearestDist = 9999999;
	var nearest_pos = {x : -1, y : -1};
	for(var i = 0; i < position_set.length; i++){	
		var x = position_set[i].x;
		var y = position_set[i].y;
		var dist = Math.abs(x - get_my_x()) + Math.abs(y - get_my_y());
		trace("dist of position " + x +","+ y + " from my x " + get_my_x() + "," + get_my_y() + " is: " +dist);
		if(dist < nearestDist){
			nearestDist = dist;
			nearest_pos = position_set[i];
		}
	}
	return nearest_pos;
}
//get_fruits
//given a fruit type, return an array of arrays, containing the positions of all the fruits of that type on the board
//fruits[type][0] = { x : x0_pos, y : y0_pos}
function get_fruit_pos_of_types(types){	
	//trace("get_fruit_pos_of_types got types: " + types);
	var board = get_board();
	var fruits = [];
	for(var x = 0; x<WIDTH; x++){
		for(var y = 0; y<HEIGHT; y++){
			if(board[x][y] > 0){
				//board[x][y] > 0 is cond in for because we know thats not a type of interest, don't wanna bother with full checks
				for(var i = 0; (i < types.length) && (board[x][y] > 0); i++){
					//if there is a fruit at this location, check if its of the types we are interested in
					if(board[x][y] == types[i]){
						if(fruits[types[i]] === undefined){
							fruits[types[i]] = [];
						}
						fruits[types[i]].push({x : x, y : y}); 	
					}
				}
			}
		}
	}
	//trace("get_fruits returning: " + JSON.stringify(fruits));
	return fruits;
}

//given two positions objects [{x : xpos, y : ypos}, {x : x1pos, y : y1pos}]
//return the distance between them
function distance_between(pos_arr){
	if(pos_arr.length != 2){
		trace("distance_between given position array of length: " + pos_arr.length+ " which is NOT 2.. aborting");
		return;
	}
	var dist = (Math.abs(pos_arr[0].x - pos_arr[1].x) + Math.abs(pos_arr[0].y - pos_arr[1].y));
	return dist;
}
function dist_bet(pos1, pos2){
	//console.log("calculating dist_bet pos1: " + JSON.stringify(pos1) + " and pos2: " + JSON.stringify(pos2));
	var dist = (Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y));
	return dist;
}

function board(board_arr){
	this.fruits = [];
	for(var i = 0; i < get_number_of_item_types()+1; i++){
		//initialize all fruits to emptylist
		this.fruits[i] = [];
	}
	this.board = [];
	for(var x = 0; x<WIDTH; x++){
		this.board[x] = [];
		for(var y = 0; y<HEIGHT; y++){
			var ftype = board_arr[x][y];
			if(ftype > 0){
				var f = new fruit(x, y, ftype);
				if(this.fruits[ftype] == null){
					this.fruits[ftype] = [];
				}
				this.fruits[ftype].push(f);
				this.board[x][y] = f;
			}
		}
	}/*
		//DONT' seem to be able to overload functions in javascript :?/
	this.remove_fruit = remove_fruit;
	function remove_fruit(ftype, x, y){
		var fs = this.fruits[ftype];
		for(var i =0; i< fs.length; i++){
			var f = fs[i];
			if(f.x == x && f.y == y){
				this.fruits.splice(i, 1);
			}
		}
		this.board[x][y] = null;
	}*/
	this.remove_fruit = remove_fruit;
	function remove_fruit(x, y){
		for(var t = 1; t<this.fruits.length; t++){
			var ftype = this.fruits[t];
			for(var i = 0; i < ftype.length; i++){
				if(ftype[i].pos.x == x && ftype[i].pos.y == y){
					ftype.splice(i, 1);
				}
			}
		}
		this.board[x][y] = null;
	}
	this.print_board = print_board;
	function print_board(){
		for(var y = 0; y<HEIGHT; y++){
			var column = "";
			for(var x = 0; x<WIDTH; x++){
				if(y > this.board[x].length){
					column = column + " 0 ";
					continue;
				}
				var ele = this.board[x][y];
				if(ele == null){
					column = column + " 0 ";
				} else {
					column = column + " "+ele.type+ " ";
				}
			}
			trace(column);
			//TODO: print column appropriately
		}
	}
	this.clone_board = clone_board;
	function clone_board(){
		var cloned_board = new Object();
		cloned_board.fruits = JSON.parse(JSON.stringify(this.fruits));
		cloned_board.board = JSON.parse(JSON.stringify(this.board));
		cloned_board.print_board = print_board;
		cloned_board.remove_fruit = remove_fruit;
		cloned_board.clone_board = clone_board;
		return cloned_board;
	}
}
function mpath(curpath){
	//holds the sequences of locations along the path
	if(curpath.pos.length < 1){
		//must have atleast one position (usually current position) in path
		trace("ERROR: curpath.pos.length < 1: " + curpath.pos.length);
	}
	if(curpath.pos.length != curpath.turns.length){
		trace("ERROR: curpath.pos.length (" + curpath.pos.length + ") != curpath.turns.length (" + curpath.turns.length+ ")");
	}
	this.pos = JSON.parse(JSON.stringify(curpath.pos));
	this.turns = JSON.parse(JSON.stringify(curpath.turns));
	this.curpos = this.pos[this.pos.length-1];
	this.dist = curpath.dist;
	this.add_position = add_position;
	function add_position(new_pos, dist){
		this.curpos = new_pos;
		this.pos.push(new_pos);
		this.dist += dist;
		this.turns.push(this.dist);
	}
	this.contains = contains;
	function contains(pos){
		for(var i = 0; i<this.pos.length; i++){
			if(this.pos[i].x == pos.x && this.pos[i].y == pos.y){
				return i;
			}
		}
		return -1;
	}
	this.clone_path = clone_path;
	function clone_path(){
		//var cloned_path = new mpath(this);
		var cloned_path = new Object();
		cloned_path.pos = JSON.parse(JSON.stringify(this.pos));
		cloned_path.turns = JSON.parse(JSON.stringify(this.turns));
		cloned_path.dist = this.dist;
		cloned_path.curpos = JSON.parse(JSON.stringify(this.curpos));
		cloned_path.clone_path = clone_path;
		cloned_path.add_position = add_position;
		cloned_path.contains = contains;
		return cloned_path;
	}
}
function fruit_state(){
	this.my_fruits = [];
	this.opp_fruits = [];
	for(var i = 1; i < (get_number_of_item_types() + 1); i++){
		//initially fruits are set to the real game-world values
		this.my_fruits[i] = get_my_item_count(i)
		this.opp_fruits[i] = get_opponent_item_count(i);
	}
	this.set_my_ftype_cnt = set_my_ftype_cnt;
	function set_my_ftype_cnt(ftype, cnt){
		if(ftype > get_number_of_item_types()){
			trace("settying fruit type: " + ftype + " which is not a fruit type in the game (max: " + get_number_of_item_types());
		}
		this.my_fruits[ftype] = cnt;
	}
	this.set_opp_ftype_cnt = set_opp_ftype_cnt;
	function set_opp_ftype_cnt(ftype, cnt){
		if(ftype > get_number_of_item_types()){
			trace("settying fruit type: " + ftype + " which is not a fruit type in the game (max: " + get_number_of_item_types());
		}
		this.opp_fruits[ftype] = cnt;
	}
	this.is_lost = is_lost;
	function is_lost(){
		var vfruits_won = this.fruits_won();
		var vfruits_lost = this.fruits_lost();
		var vfruits_tied = this.fruits_tied();
		if( (vfruits_lost > (get_number_of_item_types()/2)) || 
			( ((vfruits_won - vfruits_lost) < 0) && ((vfruits_lost + vfruits_tied + vfruits_won) == get_number_of_item_types())) ){
			//we lost more fruits than we won and there are no more fruits in contention
			return true;
		}
		return false;
	}
	this.is_won = is_won;
	function is_won(){
		var vfruits_won = this.fruits_won();
		var vfruits_lost = this.fruits_lost();
		var vfruits_tied = this.fruits_tied();
		if( (vfruits_won > (get_number_of_item_types()/2)) ||
			(((vfruits_won - vfruits_lost) > 0) && ((vfruits_lost + vfruits_tied + vfruits_won) == get_number_of_item_types())) ){
			//we won more fruits than we lost and there are no more fruits in contention
			return true;
		}
		return false;
	}
	this.is_tied = is_tied;
	function is_tied(){
		var vfruits_won = this.fruits_won();
		var vfruits_lost = this.fruits_lost();
		var vfruits_tied = this.fruits_tied();
		if((vfruits_won == vfruits_lost) && ((vfruits_won+vfruits_lost + vfruits_tied) == get_number_of_item_types())){
			//we have equal number fruits won as lost, and the remaining fruit types are tied
			return true;
		}
		return false;
	}
	this.fruits_won = fruits_won;
	function fruits_won(){
		var fw = 0;
		for(var i = 1; i<this.my_fruits.length; i++){
			var half = get_total_item_count(i)/2;
			if(this.my_fruits[i] > half){
				fw++;
			}
		}
		return fw;
	}
	this.fruits_lost = fruits_lost;
	function fruits_lost(){
		var fl = 0;
		for(var i = 1; i<this.opp_fruits.length; i++){
			var half = get_total_item_count(i)/2;
			if(this.opp_fruits[i] > half){
				fl++;
			}
		}
		return fl;
	}
	this.fruits_tied = fruits_tied;
	function fruits_tied(){
		var ft = 0;
		for(var i = 1; i<this.opp_fruits.length; i++){
			var half = get_total_item_count(i)/2;
			if(this.opp_fruits[i] == half && this.my_fruits[i] == half){
				ft++;
			}
		}
		return ft;
	}
	this.clone = clone;
	function clone(){
		var cloned_fs = new Object();
		cloned_fs.my_fruits = JSON.parse(JSON.stringify(this.my_fruits));
		cloned_fs.opp_fruits = JSON.parse(JSON.stringify(this.opp_fruits));
		cloned_fs.set_my_ftype_cnt = set_my_ftype_cnt;
		cloned_fs.set_opp_ftype_cnt = set_opp_ftype_cnt;
		cloned_fs.is_won = is_won;
		cloned_fs.is_lost = is_lost;
		cloned_fs.is_tied = is_tied;
		cloned_fs.fruits_won = fruits_won;
		cloned_fs.fruits_lost = fruits_lost;
		cloned_fs.fruits_tied = fruits_tied;
		cloned_fs.clone = clone;
		return cloned_fs;
	}
}
function position(x, y){
	this.x = x;
	this.y = y;
	this.equals = equals;
	function equals(pos){
		if(pos.x == this.x && pos.y == y){
			return true;
		}
		return false;
	}
}
function fruit(x, y, type){
	this.pos = new position(x, y);
	this.type = type;
	this.equals = equals;
	function equals(f){
		if(f.pos.equals(this.pos) && f.type == this.type){
			return true;
		}
		return false;
	}
}


//returns my path given opponent picks he worst case (for me) target given board state
//actual fruit acquiring is handled here, since opponent may beat us to target, or we may tie
//so this function should also check victory condition (and return appropriately)
//full_fruit_max: path, path, fruit, board, fruit_state, path ==> path
function full_fruit_max(my_path, opp_path, opp_credit, my_target, board, fruit_state, cur_best_path, top_level){
	
	var cur_max_path = new mo_path(new mpath({pos: [{x:-1, y:-1}], turns:[0], dist: 0}), null);
	var my_pos = my_path.pos[my_path.pos.length-1];
	var my_dist = dist_bet(my_pos, my_target.pos);
	var opp_path_clone = opp_path.clone_path();
	var board_clone = board.clone_board();
	var fruit_state_clone = fruit_state.clone();
	var remaining_fruit_sets = gen_remaining_fsets(board_clone, opp_path_clone, fruit_state_clone, opp_credit, opp_credit + my_dist + 1, my_target, my_path);
	var worst_set = -1;
	//remaining_fruit_sets
	//[{b : board, opath: path, fs: fruit_state, remaining: remaining_moves }, ...]
	for(var fset = 0; fset < remaining_fruit_sets.length; fset++){//all possible remaining fruit set that may remain after opponent has made my_dist moves){
		var my_path_clone = remaining_fruit_sets[fset].mypath; //my_path.clone_path();
		opp_path_clone = remaining_fruit_sets[fset].opath;
		board_clone = remaining_fruit_sets[fset].b;
		fruit_state_clone = remaining_fruit_sets[fset].fs;
		var res = full_fruit_min(my_path_clone, opp_path_clone, remaining_fruit_sets[fset].remaining, board_clone, fruit_state_clone, cur_best_path, false);
		if(res.m.dist >= cur_max_path.m.dist){
			cur_max_path = res;
			worst_set = fset;
			if(cur_max_path.m.dist > 99999){
				//can't get any worse than unwinnable
				if(top_level){
					trace("fruit_max. target: " + JSON.stringify(my_target)+ " found unwinnable path: " + JSON.stringify(cur_max_path));
				}
				return cur_max_path;
			}
		}
	}
	if(top_level){
		trace("worst opp_path: " + JSON.stringify(remaining_fruit_sets[worst_set].opath));
	}
	//trace("worst case for path: " + JSON.stringify(cur_max_path));
	return cur_max_path;
}
//given a fruit_state, and board return all remaining fruits on board that could be captured to gain majority
function get_fruit_targets(fs, b){
	var myfruit_cnt = fs.my_fruits;
	var oppfruit_cnt = fs.opp_fruits;
	//targets will be a list of fruits
	var targets = [];
	//types are 1 indexed
	for(var i = 1; i<b.fruits.length; i++){
		var half = get_total_item_count(i)/2;
		var maj = Math.ceil(half);
		//if I dont' already have a majority, and there are enough fruits of that type left on the board to atleast tie
		if((myfruit_cnt[i] <  maj) && ((b.fruits[i].length + myfruit_cnt[i]) >= half)){
			var fruits = b.fruits[i];
			for(var k =0; k< fruits.length; k++){
				targets.push(fruits[k]);
			}
		}
	}
	//trace("get_fruit_targets returning: " + JSON.stringify(targets));
	return targets;
}

function lost_path(curpath){
	return new mpath({pos: curpath.pos, turns:curpath.turns, dist:9999999});
}
function mo_path(mypath, opath){
	this.m = mypath;
	this.o = opath;
}
//returns the best path case (for me) target I could choose given a board state
//also, if dist > best_prev_found_min, return. should do this DFS
//full_fruit_min: path, path, board, fruit_state, path ==> {m: path, o: path}
function full_fruit_min(my_path, opp_path, opp_credit, board, fruit_state, cur_best_path, first_call){
	//trace("mypath: " + JSON.stringify(my_path) + " opp_path: " + JSON.stringify(opp_path) + " opp_credit: " + opp_credit);
	//trace("fruit_state: " + JSON.stringify(fruit_state));
	/*pclone = my_path.clone_path();
	oppclone = opp_path.clone_path();
	bclone = board.clone_board();
	fsclone = fruit_state.clone();
	*/
	if(my_path.dist > cur_best_path.m.dist){
		//path being explored has already exceeded distance of best known path, return;
		//trace("curpath(dist: " + my_path.dist + ") has exceeded distance of currenty known best path.dist: " +cur_best_path.m.dist + " returning");
		return new mo_path(my_path, opp_path);
	}
	if(fruit_state.is_won()){
		//trace("found winning path: " + JSON.stringify(my_path) + " opp_path: " + JSON.stringify(opp_path));
		explored_paths++;
		return new mo_path(my_path, opp_path);
	} else if(fruit_state.is_tied()){
		//trace("found tying path: " + JSON.stringify(my_path) + " opp_path: "  +JSON.stringify(opp_path));
		explored_paths++;
		return new mo_path(my_path, opp_path);
	} else if(fruit_state.is_lost()){
		//trace("fs: " + JSON.stringify(fruit_state));
		explored_paths++;
		var losing_path = lost_path(my_path);
		//trace("losing path: returning: " + JSON.stringify(losing_path) + " opp_path: " + JSON.stringify(opp_path));
		return new mo_path(losing_path, opp_path);
	}
	var remain_pot_fruit = get_fruit_targets(fruit_state, board);
	for(var i = 0; i < remain_pot_fruit.length; i++){ //every fruit remaining that I can still get a majority for that type){
		var target_fruit = remain_pot_fruit[i];
		var res = full_fruit_max(my_path, opp_path, opp_credit, target_fruit, board, fruit_state, cur_best_path, first_call);
		if(res.m.dist < 9999){
			return res;
		}
		/*
		if(res.m.dist < cur_best_path.m.dist){
			cur_best_path = res;
			if(first_call){
				trace("found new best path: " + JSON.stringify(cur_best_path));
			}
		}
		*/
	}
	return cur_best_path;
}
//gen_remaining_fruits: board, path, fruit_state, int, int ==> [{b : board, opath : path, fs: fruit_state, remaining: int, mypath: path}, {b : board, opath: path, fs: fruit_state, remaining: int}, ...] 
function gen_remaining_fsets(board, opp_path, fruit_state, outside_dist, opp_moves, target, my_path){
	//REMEMBER opp_moves does NOT includes time it takes me to eat fruit
	var mpath_clone = my_path.clone_path();
	var nboard = board.clone_board();
	var fs_clone = fruit_state.clone();
	fs_clone.set_my_ftype_cnt(target.type, fruit_state.my_fruits[target.type]+1);
	nboard.remove_fruit(target.pos.x, target.pos.y);
	mpath_clone.add_position(target.pos, (dist_bet(my_path.curpos, target.pos)+1));
	var ret = [{b : nboard, opath : opp_path, fs: fs_clone, remaining : opp_moves, mypath: mpath_clone}];
	var opp_pos = opp_path.pos[opp_path.pos.length-1];
	for(var type = 1; type<board.fruits.length; type++){//get_number_of_item_types()+1; type++){
		//console.log("checking for fruits we can get of type " + type);
		var fruits = board.fruits[type];
		//console.log("board has fruits: " + JSON.stringify(fruits) + " of type : " + type);
		for(var i = 0; i < fruits.length; i++){
			var f = fruits[i];
			var dist = dist_bet(f.pos, opp_path.curpos);
			//console.log("dist_bet pos1: " + JSON.stringify(f.pos) + " pos2: " + JSON.stringify(opp_path.curpos) + " = " + dist_bet);
			var nboard = board.clone_board();
			var op_clone = opp_path.clone_path();
			var mpath_clone = my_path.clone_path();
			var fs_clone = fruit_state.clone(); 
			var remaining_moves = opp_moves - (dist+1);
			//opp_moves does include time it takes my_robot to eat fruit, so +1 dist
			if((dist + 1) < opp_moves && outside_dist <= dist){
				//fruits we can get to before my_robot
				var r;
				if(f.pos.y == target.pos.y && f.pos.x == target.pos.x && f.type == target.type){//equals(target)){
					//we beat my robot to target, update board, mypath, oppath, fs and return
					nboard.remove_fruit(f.pos.x, f.pos.y);
					op_clone.add_position(f.pos, (dist+1));
					fs_clone.set_opp_ftype_cnt(f.type, fs_clone.opp_fruits[f.type] + 1);
					var turns_in = op_clone.turns[op_clone.turns.length-1] - my_path.turns[my_path.turns.length-1]
					if(turns_in <=0){
						trace("turns_in <= 0!!!***************");
					}
					var my_partway_pos = get_position_along_path(my_path.curpos, target.pos, turns_in);
					//trace("beaten to target: " + JSON.stringify(target.pos) + " turns_in: " + (dist +1) + " we ended up at position: " + JSON.stringify(my_partway_pos));
					mpath_clone.add_position(my_partway_pos, turns_in);
					r = {b : nboard, opath: op_clone, fs: fs_clone, remaining: 0, mypath: mpath_clone}; 
				} else {
					//we got to opp_target(f), and we still have time left, recurse
					nboard.remove_fruit(f.pos.x, f.pos.y);
					op_clone.add_position(f.pos, (dist+1));
					fs_clone.set_opp_ftype_cnt(f.type, fs_clone.opp_fruits[f.type] + 1);
					r = gen_remaining_fsets(nboard, op_clone, fs_clone, 0, remaining_moves, target, my_path);
				}
				ret = ret.concat(r);
			} else if((dist+1) == opp_moves){
				//fruits we can get to at same time as my_robot
				op_clone.add_position(f.pos, (dist+1));
				mpath_clone.add_position(target.pos, dist_bet(target.pos, my_path.curpos)+1);
				if(f.pos.y == target.pos.y && f.pos.x == target.pos.x && f.type == target.type){//f.equals(target)){
					//tie and we both had same target
					fs_clone.set_opp_ftype_cnt(target.type, fs_clone.opp_fruits[target.type]+.5);
					fs_clone.set_my_ftype_cnt(target.type, fs_clone.my_fruits[target.type]+.5);
					nboard.remove_fruit(target.pos.x, target.pos.y);
				} else {
					//tie between opp_bot and my_bot
					nboard.remove_fruit(f.pos.x, f.pos.y);
					nboard.remove_fruit(target.pos.x, target.pos.y);
					fs_clone.set_opp_ftype_cnt(f.type, fs_clone.opp_fruits[f.type]+1);
					fs_clone.set_my_ftype_cnt(target.type, fs_clone.my_fruits[target.type]+1);
				}
				ret = ret.concat({b: nboard, opath: op_clone, fs: fs_clone, remaining: 0, mypath: mpath_clone});
			}
		}
	}
	return ret;
}


//given fruit positions, opponent_pos and moves, return the set of potential remaining positions in the following format
//[{pos : [{x : x0, y : y0}, {x : x1, y : y1}, ...], opp_path_info : {path: [{x : opp_x_pos, y : opp_y_pos}, ...], turns: [turns it took to get to pos i, ...], dist: total_path_distance}, opp_moves : opp_remaining_moves}, ...]
//where position contains the positions of the remaining fruits on the board
function gen_remaining_pot_positions(positions, opponent_path_info, outside_dist, opponent_moves){
	//TODO: something for ties here. ties aren't currently being taken into account
	//trace("gen_remaining_pot_positions: positions: " + JSON.stringify(positions) + " opp_path_info: " + JSON.stringify(opponent_path_info) + " opp_moves: " + opponent_moves + "outside_dist: " + outside_dist + " additional(opponent_moves): " + opponent_moves);
	var rpot = [{pos : positions, opp_path_info: opponent_path_info, opp_moves: opponent_moves}];
	var opp_pos_index = opponent_path_info.path.length-1;
	var opponent_pos = opponent_path_info.path[opp_pos_index];
	for(var i = 0; i < positions.length; i++){
		var dist_bet = distance_between([opponent_pos, positions[i]]);
		//strictly less because they need 1 turn to eat fruit
		if(dist_bet < opponent_moves && outside_dist <= dist_bet){
			var remaining_moves = opponent_moves - dist_bet;
			//clone referenced objects for recursive call
			var sliced_positions = positions.slice(0);
			//i can't believe this is the easiest way to clone an object in javascript :s
			var opp_path_info_clone = JSON.parse(JSON.stringify(opponent_path_info));

			sliced_positions.splice(i, 1);
			//push new position onto path array, update distance, and turns
			opp_path_info_clone.path.push(positions[i]);
			opp_path_info_clone.dist += dist_bet+1;
			opp_path_info_clone.turns.push(opponent_path_info.turns[opp_pos_index] + dist_bet+1);

			//remaining_moves - 1 because of eating turn
			var r = gen_remaining_pot_positions(sliced_positions, opp_path_info_clone, 0, remaining_moves-1);
			//trace("concatenating rpot: " + JSON.stringify(rpot) + " and r: " + JSON.stringify(r));
			rpot = rpot.concat(r);
			//rpot.push({pos : sliced_positions, opp_pos : positions[i], opp_remaining_moves : remaining_moves}); 
		}
	}
	//trace("gen_remaining_pot_positions returning: " + JSON.stringify(rpot));
	return rpot;
}

//given a start position and an end position and a number of turns,
//return the position my bot would be at if it were trying to go from start to end
//assuming it can't get to the end in turns moves
function get_position_along_path(start_pos, end_pos, turns){
//	trace("get_positions_along_path(sp: " + JSON.stringify(start_pos) + " ep: " + JSON.stringify(end_pos) + " turns: " + turns);
	var rpos = {x : -1, y : -1};
	var xdif = Math.abs(start_pos.x - end_pos.x);
	var xremainder = turns - xdif;
	if(xremainder > 0){
		//completed the x portion of the movement
		var ydif = Math.abs(start_pos.y - end_pos.y);
		rpos.x = end_pos.x;
		if(start_pos.y > end_pos.y){
			//movement was upward (subtract xremainder from start.y)
			rpos.y = start_pos.y - xremainder;
		} else {
			rpos.y = start_pos.y + xremainder;
		}
	} else {
		//didn't complete x portion of movement
		rpos.y = start_pos.y;
		if(start_pos.x > end_pos.x){
			//movement was rightward (subtract xremainder from end.x)
			rpos.x = end_pos.x - xremainder;
		} else {
			//movement was leftward (add xremainder to end.x)
			rpos.x = end_pos.x + xremainder;
		}
	}
	return rpos;
}

function test1(){
	HEIGHT = 4; WIDTH = 4;
	var ba = [[0, 1, 0, 0], [3, 0, 2, 3], [0, 0, 0, 2], [0, 3, 0, 0]];
	var b = new board(ba);
	var my_init_path = new mpath({pos: [{x: 0, y: 3}], turns:[0], dist:0});
   var opp_init_path = new mpath({pos: [{x: 0, y: 3}], turns:[0], dist:0});
   var init_fs = new fruit_state();
   var no_best_path = new mo_path(new mpath({pos: [{x: -1, y: -1}], turns:[999999], dist:9999999999}), null);
   var path = full_fruit_min(my_init_path, opp_init_path, 0, b, init_fs, no_best_path, true);
   trace("found optimal path: " + JSON.stringify(path));
}

function max_opp_move1(curpath, target_pos, fruit_positions, current_num_fruit, remaining_board_fruit, ftype, opponent_path_info, opponent_moves){
	//trace("max_opp_move1: curpath: " + JSON.stringify(curpath) + " target_pos: " + JSON.stringify(target_pos) + " opponent_path_info: " + JSON.stringify(opponent_path_info) + " opp_moves: " + opponent_moves);
	//
	var maxmove = {dist: 0, path: []};
	var dist = distance_between([curpath.path[curpath.path.length-1], target_pos]) + 1;
	var remaining_pos = gen_remaining_pot_positions(fruit_positions, opponent_path_info, opponent_moves, opponent_moves + dist);
	//trace("dist to target: " + dist);
	//trace("all remaining_pos sets: " + JSON.stringify(remaining_pos));

	for(var i = 0; i < remaining_pos.length; i++){
		if(remaining_pos[i].length + current_num_fruit < get_total_item_count(ftype)/2){
			maxmove = {dist : 99999999, path : curpath_clone.path};
			break;
		}
		var rpath = {dist : 0};
		var target_pos_index = remaining_pos[i].pos.indexOf(target_pos);
		//trace("remaining fruit_positions: " + JSON.stringify(remaining_pos[i].pos));
		var curpath_clone =  JSON.parse(JSON.stringify(curpath));
		if(target_pos_index != -1){
			//if our target is in this remaining fruit set(remaining_pos[i]) then we made it, solve_min for that new position
			curpath_clone.path.push(target_pos);
			curpath_clone.dist += dist; //+ 1 to eat the fruit
			curpath_clone.turns.push(curpath_clone.dist);
			remaining_pos[i].pos.splice(target_pos_index, 1);
			//trace("max_opp_move trying remaining_pos set : " + JSON.stringify(remaining_pos[i].pos));
			rpath = brute_tsp_solver(curpath_clone, remaining_pos[i].pos, current_num_fruit+1, remaining_pos[i].pos.length, ftype, remaining_pos[i].opp_path_info, remaining_pos[i].opp_moves);
		} else {
			//else we were beaten to our target. 
			//if we were heading toward the target find out where we stopped, and solve_min for that new position

			//is curpath_target_index always curpath.path.length-1 ??
			var curpath_last_pos_turns = curpath.turns[curpath.path.length - 1];
			//trace("turns to curpaths last position: " + curpath_last_pos_turns);
			var opp_path_target_turn_index = remaining_pos[i].opp_path_info.path.indexOf(target_pos);
			var opp_turns_to_target = remaining_pos[i].opp_path_info.turns[opp_path_target_turn_index]; 
			var turns_in = opp_turns_to_target - curpath_last_pos_turns;
			if((curpath.dist + dist) < opp_turns_to_target){
				trace(" uhh what, this shouldn't happen");
			}
			if(turns_in > 0){//opp_turns_to_target > curpath_last_pos_turns){
				//in this case, we have started to move towards target

				//trace("curpath.dist + dist = our turns to the target?("+JSON.stringify(target_pos)+"): "+ (curpath.dist+dist) + " opp_turns_to_target: " + opp_turns_to_target);
				//trace("curpath.dist: " + curpath.dist + " curpath_last_pos_turns: " + curpath_last_pos_turns + " dist: " + dist);
				if((curpath.dist + dist) == opp_turns_to_target){
					//we tied with the opponent
					curpath_clone.path.push(target_pos);
					curpath_clone.dist += dist; //+ 1 to eat the fruit
					curpath_clone.turns.push(curpath_clone.dist);
					//remaining_pos[i].pos.splice(target_pos_index, 1);
					//trace("max_opp_move trying remaining_pos set : " + JSON.stringify(remaining_pos[i].pos));
					rpath = brute_tsp_solver(curpath_clone, remaining_pos[i].pos, current_num_fruit+0.5, remaining_pos[i].pos.length, ftype, remaining_pos[i].opp_path_info, remaining_pos[i].opp_moves);
				} else {
					//the opponent got there first, and we are at new_pos
					//trace("curpath: " + JSON.stringify(curpath) + "opp_path: " + JSON.stringify(remaining_pos[i].opp_path_info.path) + " beat us to target: " + JSON.stringify(target_pos) + " " + opp_turns_to_target + " turns in"); 
					var new_pos = get_position_along_path(curpath_clone.path[curpath_clone.path.length-1], target_pos, turns_in);
					//trace("we ended up at pos: " + JSON.stringify(new_pos) +  " along path");
					curpath_clone.turns.push(opp_turns_to_target);
					curpath_clone.path.push(new_pos);
					curpath_clone.dist += turns_in;
					remaining_pos[i].opp_path_info.path = remaining_pos[i].opp_path_info.path.slice(0, opp_path_target_turn_index+1);
					remaining_pos[i].opp_path_info.turns = remaining_pos[i].opp_path_info.turns.slice(0, opp_path_target_turn_index+1);
					remaining_pos[i].opp_path_info.dist = opp_turns_to_target;

					//pay close attention to opp_moves. may be wrong 

					rpath = brute_tsp_solver(curpath_clone, remaining_pos[i].pos, current_num_fruit, remaining_pos[i].pos.length, ftype, remaining_pos[i].opp_path_info, 0); //remaining_pos[i].opp_moves);
				}
			} else if(turns_in < 0){
				//UPDATE: CHANGED GEN_REMAINING_POSITIONS So i don't think this branch should ever happen
				trace("*************THIS SHOULD NEVER HAPPEN **********");
				trace("curpath: " + JSON.stringify(curpath_clone) + " target: " + JSON.stringify(target_pos) + " opp_path: " + JSON.stringify(remaining_pos[i].opp_path_info) + " dist: " + dist);
				trace("remaining_fruits: " + JSON.stringify(remaining_pos[i].pos));
						//rpath = brute_tsp_solver(curpath_clone, remaining_pos[i].pos, current_num_fruit, remaining_pos[i].pos.length, ftype, remaining_pos[i].opp_path_info, remaining_pos[i].opp_moves);
			} else {
				//TODO: not really sure what should go here.
				//target was picked up at the same time as we were considering it,
				//trace("target was picked up at same time as consideration");
			}

		}
		//trace("max_opp got result path: " + JSON.stringify(rpath));
		if(rpath.dist > 99999){
			//if we found a losing branch, return it immediately. can't get any 'maxer' than that
			return rpath;
		}
		if(rpath.dist > maxmove.dist){
			//trace("found new max dist_path: " + JSON.stringify(rpath) + " remaining_set: " + JSON.stringify(remaining_pos[i].pos));
			maxmove = rpath;
		}

	}
	//trace("max_opp_move1 returning maxmove: " + JSON.stringify(maxmove)); 
	return maxmove;
}


function make_move() {
   var board_arr = get_board();
   explored_paths = 0;
   var mboard = new board(board_arr);
	var my_init_path = new mpath({pos: [{x: get_my_x(), y: get_my_y()}], turns:[0], dist:0});
   var opp_init_path = new mpath({pos: [{x: get_opponent_x(), y: get_opponent_y()}], turns:[0], dist:0});
   var init_fs = new fruit_state();
   var no_best_path = new mo_path(new mpath({pos: [{x: -1, y: -1}], turns:[999999], dist:9999999999}), null);
   var path = full_fruit_min(my_init_path, opp_init_path, 0, new board(board_arr), init_fs, no_best_path, true);
   trace("found optimal path: " + JSON.stringify(path));
   trace("explored: " + explored_paths + " paths");
   var x = get_my_x(); var y = get_my_y();
   var destY = path.m.pos[1].y;
   var destX = path.m.pos[1].x;
   trace("destination fruit is at " + destX + ", "+destY + " (current location "+x+", "+y+")");
   // we found an item! take it!
   if (get_my_x() == destX && get_my_y() == destY) {
       return TAKE;
   }
   var difx = destX - get_my_x();
   if (difx < 0) return WEST;
   if (difx > 0) return EAST;
   var dify = destY - get_my_y();
   if (dify < 0) return NORTH;
   if (dify > 0) return SOUTH;

   return PASS;
}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//

/*
function default_board_number() {
	return 211655
}*/
