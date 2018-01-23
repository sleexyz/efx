// @flow
import { EFX, type Store } from "../";

// type-level test:
// application state type variable should be preserved after functor application
() => {
  const efx: EFX<{ foo: number }> = new EFX();

  {
    // ok
    const store: efx.Store = new efx.Store({
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

() => {
  const efx: EFX<{ foo: number }> = new EFX();

  {
    // ok
    const action = new efx.Action(() => store => {
      store.state.foo;
    });
  }

  {
    const action = new efx.Action(() => store => {
      // $ExpectError
      store.state.bar;
    });
  }
}
