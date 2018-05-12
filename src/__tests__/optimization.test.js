// @flow
import * as React from "react";
import { mount } from "enzyme";
import * as TestUtils from "./test_utils";
import * as EFX from "../";

function connect(component, mapStateToProps) {
  return EFX.connect(component, mapStateToProps, {});
}
class ExampleComponent extends React.Component<*, *> {
  renderTimes = 0;
  render() {
    this.renderTimes += 1;
    return (
      <div>
        {this.props.foo} {this.props.id}
      </div>
    );
  }
}
function mountWithStore(element, options) {
  const store = options.store;
  return mount(<EFX.Provider store={store}>{element}</EFX.Provider>);
}

describe("optimization", () => {
  it("does not re-render if irrelevant keys change", () => {
    const store = new EFX.Store({
      foo: 1,
      bar: 2
    });
    const Connected = connect(ExampleComponent, ({ foo }) => ({
      foo
    }));
    const wrapper = mountWithStore(<Connected id={2} />, { store });
    expect(wrapper.find(ExampleComponent).instance().renderTimes).toBe(1);
    store.state.bar += 1;
    expect(wrapper.find(ExampleComponent).instance().renderTimes).toBe(1);
  });

  it("does not re-render when shallow equality passes", () => {
    const store = new EFX.Store({
      foo: 1,
      bar: {}
    });
    const Connected = connect(ExampleComponent, ({ bar }) => ({
      bar
    }));
    const wrapper = mountWithStore(<Connected id={2} />, { store });
    expect(wrapper.find(ExampleComponent).instance().renderTimes).toBe(1);
    store.state.bar.x = 0; // we didn't update reference of bar
    expect(wrapper.find(ExampleComponent).instance().renderTimes).toBe(1);
  });

  it("re-renders when shallow equality fails", () => {
    const store = new EFX.Store({
      foo: 1,
      bar: {}
    });
    const Connected = connect(ExampleComponent, ({ bar }) => ({
      bar
    }));
    const wrapper = mountWithStore(<Connected id={2} />, { store });
    expect(wrapper.find(ExampleComponent).instance().renderTimes).toBe(1);
    store.state.bar = {};
    expect(wrapper.find(ExampleComponent).instance().renderTimes).toBe(2);
  });
});
