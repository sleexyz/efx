// @flow
import * as EFX from "../";

type AppState = {
  foo: number
};

// type-level test:
// application state type variable should be preserved after functor application
() => {
  const efx: EFX.EFX<AppState> = new EFX.EFX();

  {
    // ok
    const store = new efx.Store({
      foo: 1
    });
  }


  {
    // $ExpectError
    const store = new efx.Store({
      foo: "hello"
    });
  }
}
