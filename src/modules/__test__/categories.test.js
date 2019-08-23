/*global jest*/
/*global expect*/
import { categoriesReducer, fetchAllCategories, deleteCategory, saveCategory } from '../categories';
import mockAxios from "axios";

//Reducer testing

describe("categories reducer actions", () => {
  const initialState = {
    closeDialog: false,
    loading: false,
    rows: [{ id: 2, test: "test2" }],
  };

  it("category fetch row done", () => {
    const action = {
      type: "CATEGORY_FETCH_ROWS_DONE",
      payload: [{ test: "test1" }]
    };

    const expectedState = {
      ...initialState,
      rows: [{ test: "test1" }]
    };

    expect(categoriesReducer(initialState, action)).toEqual(expectedState);
  });

  it("category post done", () => {
    const action = {
      type: "CATEGORY_POST_DONE",
      payload: { test: "test1" }
    };

    const expectedState = {
      ...initialState,
      rows: [...initialState.rows, { test: "test1" }]
    };

    expect(categoriesReducer(initialState, action)).toEqual(expectedState);
  });

  it("category put done", () => {
    const action1 = {
      type: "CATEGORY_PUT_DONE",
      payload: { id: 1, test: "test1" }
    };

    const action2 = {
      type: "CATEGORY_PUT_DONE",
      payload: { id: 2, test: "test2" }
    };

    const expectedState1 = {
      ...initialState,
      rows: [...initialState.rows]
    };

    const expectedState2 = {
      ...initialState,
      rows: [{ id: 2, test: "test2" }]
    };
    expect(categoriesReducer(initialState, action1)).toEqual(expectedState1);
    expect(categoriesReducer(initialState, action2)).toEqual(expectedState2);
  });

  it("category delete done", () => {
    const action = {
      type: "CATEGORY_DELETE_DONE",
      payload: 2
    };

    const expectedState = {
      ...initialState,
      rows: []
    };

    expect(categoriesReducer(initialState, action)).toEqual(expectedState);
  });

  it("default", () => {
    const action = {
      type: 'default',
    };

    const expectedState = {
      ...initialState
    };

    const inputState = categoriesReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
  });
});

//=============================================================================
//ActionCreators Testing
//=============================================================================

describe("ActionCreators Testing", () => {
  const getState = () => {
    return {
      categories: { closeDialog: false,loading: false,rows:{id:1,name:"name1"} },
      auth: {
        user: {
          signInUserSession: {
            accessToken: { jwtToken: "123456789" }
          }
        }
      }
    };
  };

  it("fetch categories with data", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { data: [{ id: 1, name: "item1" }] }
      })
    );
    
    const expectedAction1 =[{
      type: 'CATEGORY_BEGIN_LOADING'
    }];
    
    const expectedAction2 = [{
      type: 'CATEGORY_FETCH_ROWS_DONE',
      payload: [{ id: 1, name: "item1" }]
    }];

    const dispatch = jest.fn();
    await fetchAllCategories()(dispatch, getState);
    expect(dispatch.mock.calls[0]).toEqual(expectedAction1);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction2);
  });

  it("category delete", async () => {
    mockAxios.delete.mockImplementationOnce(() =>
      Promise.resolve({
        data: "delete id 1"
      })
    );
    
    const expectedAction1 =[{
      type: 'CATEGORY_BEGIN_LOADING'
    }]; 
    
    const expectedAction2 = [{
      type: 'CATEGORY_DELETE_DONE',
      payload: 1
    }];

    const dispatch = jest.fn();
    const category={id:1, name:"item1"};
    await deleteCategory(category)(dispatch, getState);
    expect(dispatch.mock.calls[0]).toEqual(expectedAction1);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction2);
  });

  it("category save", async () => {
    const category_id = {
      id: 1,
      name: "item 11"
    };

    const category = {
      name: "item 5"
    };

    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { data: { id: 5, name: "item 5" } }
      })
    );

    mockAxios.put.mockImplementationOnce(() =>
      Promise.resolve({
        data: { data: { id: 1, name: "item 11" } }
      })
    );
    
    const expectedAction =[{
      type: 'CATEGORY_BEGIN_LOADING'
    }];
    
    const expectedAction_post = [{
      type: 'CATEGORY_POST_DONE',
      payload: { id: 5, name: "item 5" }
    }];

    const expectedAction_put = [{
      type: 'CATEGORY_PUT_DONE',
      payload: { id: 1, name: "item 11" }
    }];
    
    const dispatch_put = jest.fn();
    const dispatch_post = jest.fn();
    await saveCategory(category_id)(dispatch_put, getState);
    expect(dispatch_put.mock.calls[0]).toEqual(expectedAction);
    expect(dispatch_put.mock.calls[1]).toEqual(expectedAction_put);
    await saveCategory(category)(dispatch_post, getState);
    expect(dispatch_post.mock.calls[0]).toEqual(expectedAction);
    expect(dispatch_post.mock.calls[1]).toEqual(expectedAction_post);
  });
});