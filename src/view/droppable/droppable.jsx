// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import type { Props, Provided, StateSnapshot, DefaultProps } from './droppable-types';
import type { DroppableId } from '../../types';
import DroppableDimensionPublisher from '../droppable-dimension-publisher/';
import Placeholder from '../placeholder/';
import {
  droppableIdKey,
  styleContextKey,
} from '../context-keys';

type Context = {|
  [typeof droppableIdKey]: DroppableId
|}

export default class Droppable extends Component<Props> {
  /* eslint-disable react/sort-comp */
  styleContext: string
  ref: ?HTMLElement = null

  // Need to declare childContextTypes without flow
  static contextTypes = {
    [styleContextKey]: PropTypes.string.isRequired,
  }

  constructor(props: Props, context: Object) {
    super(props, context);

    this.styleContext = context[styleContextKey];
  }

  // Need to declare childContextTypes without flow
  // https://github.com/brigand/babel-plugin-flow-react-proptypes/issues/22
  static childContextTypes = {
    [droppableIdKey]: PropTypes.string.isRequired,
  }

  getChildContext(): Context {
    const value: Context = {
      [droppableIdKey]: this.props.droppableId,
    };
    return value;
  }

  /* eslint-enable */

  // React calls ref callback twice for every render
  // https://github.com/facebook/react/pull/8333/files
  setRef = (ref: ?HTMLElement) => {
    // TODO: need to clear this.state.ref on unmount
    if (ref === null) {
      return;
    }

    if (ref === this.ref) {
      return;
    }

    this.ref = ref;
  }

  getDroppableRef = (): ?HTMLElement => this.ref;

  getPlaceholder() {
    if (!this.props.placeholder) {
      return null;
    }

    return (
      <Placeholder placeholder={this.props.placeholder} />
    );
  }

  render() {
    const {
      children,
      direction,
      droppableId,
      ignoreContainerClipping,
      isDraggingOver,
      isDropDisabled,
      draggingOverWith,
      type,
    } = this.props;
    const provided: Provided = {
      innerRef: this.setRef,
      placeholder: this.getPlaceholder(),
      droppableProps: {
        'data-react-beautiful-dnd-droppable': this.styleContext,
      },
    };
    const snapshot: StateSnapshot = {
      isDraggingOver,
      draggingOverWith,
    };

    return (
      <DroppableDimensionPublisher
        droppableId={droppableId}
        type={type}
        direction={direction}
        ignoreContainerClipping={ignoreContainerClipping}
        isDropDisabled={isDropDisabled}
        getDroppableRef={this.getDroppableRef}
      >
        {children(provided, snapshot)}
      </DroppableDimensionPublisher>
    );
  }
}
