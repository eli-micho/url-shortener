import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LinkList, { TLink } from './LinkList';

describe('<LinkList />', () => {
  it('should render without error', () => {
    const noLinks = [];
    render(
      <LinkList links={noLinks} setMessageAlert={() => console.log('alert')} />
    );

    const list = screen.queryByTestId('linklist');
    expect(list).toBeNull();
  });

  it('should render a list item when the list has items in it', () => {
    const links: TLink[] = [
      {
        originalURL: 'www.google.ca',
        shortCode: '531',
        _id: '1',
      },
    ];
    render(
      <LinkList links={links} setMessageAlert={() => console.log('alert')} />
    );

    const li = screen.queryAllByRole('listitem');
    expect(li.length).toEqual(1);
  });
});
