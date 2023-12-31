import { runSaga } from "redux-saga";

async function recordSaga(saga, initialAction) {
  const dispatched = [];

  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    saga,
    initialAction
  );

  return dispatched;
}

export default recordSaga;
