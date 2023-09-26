import React from 'react';
import {FrigadeProvider} from '../index';

describe('Frigade Provider test suite', () => {
  it('component exist', () => {
    const component = (
      <FrigadeProvider publicApiKey='abc' userId='user-123'>
      </FrigadeProvider>
    );

    expect(component).toBeDefined();
  });
});
