// @flow
import { EFX, type Action } from "../";

// type-level test:
// application state type variable should be preserved after functor application
() => {
  const efx: EFX<{ foo: number }> = new EFX();

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

// type-level test:
// action store access is statically checked
() => {
  const efx: EFX<{ foo: number }> = new EFX();

  {
    const action = efx.makeAction(() => store => {
      // ok
      return store.state.foo;
    });
  }

  {
    const action = efx.makeAction(() => store => {
      // $ExpectError
      return store.state.boo;
    });
  }
}

// type-level test:
// action output is statically checked
() => {
  const efx: EFX<{ foo: number }> = new EFX();

  {
    const action: Action<void, number> = efx.makeAction(() => store => {
      // ok
      return store.state.foo;
    });
  }

  {
    // $ExpectError
    const action: Action<void, string> = efx.makeAction(() => store => {
      return store.state.foo;
    });
  }
}
