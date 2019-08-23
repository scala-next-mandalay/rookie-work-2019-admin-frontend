import axios from 'axios';
import { URL_GET_ALL_CATEGORIES, URL_POST_CATEGORY, URL_PUT_CATEGORY , URL_DELETE_CATEGORY} from '../constants';
import format from 'string-format';

const initialState = {
  rows: [],
  closeDialog: false,
  loading:false
};

//=============================================================================
//Reducer
//=============================================================================
export const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CATEGORY_FETCH_ROWS_DONE':
      return {
        ...state,
        rows: action.payload,
        loading: false
      };
      
    case 'CATEGORY_POST_DONE':
      return {
        ..._getCommonState(state),
        rows: [...state.rows, action.payload]
      };
      
    case 'CATEGORY_PUT_DONE':
      return _category_put_done(state, action);
      
    case 'CATEGORY_DELETE_DONE':
      return _category_delete_done(state, action);
    
    case 'CATEGORY_CLOSE_DIALOG':
      return {
        ...state,
        closeDialog: action.payload
      };
      
    case 'CATEGORY_BEGIN_LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

const _category_put_done = (state, action) => {
  const newRows =  [];
  for (const row of state.rows) {
    if (row.id === action.payload.id) {
      //updated row
      newRows.push(action.payload);
    }
    else {
      newRows.push(row);
    }
  }
  
  return {
    ..._getCommonState(state),
    rows: newRows
  };
};

const _category_delete_done = (state, action) => {
  const newRows =  [];
  for (const row of state.rows) {
    if (row.id !== action.payload) {
      newRows.push(row);
    }
  }
  
  return {
    ..._getCommonState(state),
    rows: newRows
  };
};

const _getCommonState = (state) => ({
  ...state,
  loading: false,
  closeDialog: false,
});

//=============================================================================
//ActionCreators
//=============================================================================


export const saveCategory = (category) => {
  return async (dispatch, getState) => {
    
    dispatch({
        type: 'CATEGORY_BEGIN_LOADING'
      });
      
    if (!getState().auth.user) {
        return;
      }
  
      const token = getState().auth.user.signInUserSession.accessToken.jwtToken;

      const auth = {
          headers: {Authorization:'Bearer ' + token } 
      };
    if (!category.id) {
      //insert
      const axRes = await axios.post(URL_POST_CATEGORY, {name: category.name},auth);
      dispatch({
        type: 'CATEGORY_POST_DONE',
        payload: axRes.data.data
      });
    }
    else {
      //update
      const url = format(URL_PUT_CATEGORY, category.id);
      const axRes = await axios.put(url, {name: category.name},auth);
      dispatch({
        type: 'CATEGORY_PUT_DONE',
        payload: axRes.data.data
      });
    }
  };
};

export const deleteCategory = (category) => {
  return async (dispatch, getState) => {
    
      dispatch({
        type: 'CATEGORY_BEGIN_LOADING'
      });
      
      if (!getState().auth.user) {
        return;
      }
  
      const token = getState().auth.user.signInUserSession.accessToken.jwtToken;

      const auth = {
          headers: {Authorization:'Bearer ' + token } 
      };
      //delete
      const url = format(URL_DELETE_CATEGORY, category.id);
      await axios.delete(url,auth);
      dispatch({
        type: 'CATEGORY_DELETE_DONE',
        payload: category.id
      });
    
  };
};

export const fetchAllCategories = () => {
  return async (dispatch, getState) => {
    //console.log('fetchAllCategories:START')
    
    dispatch({
      type: 'CATEGORY_BEGIN_LOADING'
    });
    
    if (!getState().auth.user) {
        return;
      }

    const token = getState().auth.user.signInUserSession.accessToken.jwtToken;

    const auth = {
        headers: {Authorization:'Bearer ' + token } 
    };
    // const axRes = await axios.get(URL_GET_ALL_CATEGORIES)
    const url = format(URL_GET_ALL_CATEGORIES, getState().categories.rows.length);
    const axRes = await axios.get(url,auth);
    
    //console.log('fetchAllCategories:END')

    dispatch({
      type: 'CATEGORY_FETCH_ROWS_DONE',
      payload: axRes.data.data
    });
  };
};

export const dialogBox = (val) => ({
  type: 'CATEGORY_CLOSE_DIALOG',
  payload: val
})