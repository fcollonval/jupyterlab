// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';
import { TableOfContents } from './tokens';
import { TreeItem } from '@jupyter/react-components';

/**
 * Interface describing component properties.
 */
export interface ITableOfContentsItemsProps {
  /**
   * Whether this item is active or not.
   */
  isActive: boolean;
  /**
   * Heading to render.
   */
  heading: TableOfContents.IHeading;

  /**
   * On `mouse-down` event callback.
   */
  onMouseDown: (heading: TableOfContents.IHeading) => void;

  /**
   * Collapse/Expand event callback.
   */
  onToggleCollapse: (heading: TableOfContents.IHeading) => void;
}

/**
 * React component for a table of contents entry.
 */
export class TableOfContentsItem extends React.PureComponent<
  React.PropsWithChildren<ITableOfContentsItemsProps>
> {
  /**
   * Renders a table of contents entry.
   *
   * @returns rendered entry
   */
  render(): JSX.Element | null {
    const { children, isActive, heading, onToggleCollapse, onMouseDown } =
      this.props;

    // Handling toggle of collapse and expand
    const handleToggle = () => {
      // This will toggle the state and call the appropriate collapse or expand function
      onToggleCollapse(heading);
    };

    return (
      <TreeItem
        className={'jp-tocItem jp-TreeItem'}
        selected={isActive}
        expanded={!heading.collapsed}
        onClick={handleToggle}
      >
        <div
          className="jp-tocItem-heading"
          onMouseDown={(event: React.SyntheticEvent<HTMLDivElement>) => {
            // React only on deepest item
            if (!event.defaultPrevented) {
              event.preventDefault();
              onMouseDown(heading);
            }
          }}
        >
          <span
            className="jp-tocItem-content"
            title={heading.text}
            {...heading.dataset}
          >
            {heading.prefix}
            {heading.text}
          </span>
        </div>
        {children}
      </TreeItem>
    );
  }
}
