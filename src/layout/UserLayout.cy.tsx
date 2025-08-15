import React from 'react'
import UserLayout from './UserLayout'

describe('<UserLayout />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserLayout />)
  })
})