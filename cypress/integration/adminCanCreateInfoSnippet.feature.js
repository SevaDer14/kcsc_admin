/* eslint-disable no-undef */
import sizes from '../support/index'
import TestHelpers from '../support/testhelper'

describe('Admin is able to create an info snippet ', () => {
  sizes.forEach((size) => {
    describe(`on ${size}`, () => {
      const selection = 'information-create'
      beforeEach(() => {
        cy.intercept('POST', '**/information', {
          message: 'Your information snippet has successfully been created',
        })
        cy.intercept('GET', '**/information**', {
          fixture: 'information_items.json',
        })
        cy.intercept('GET', '**/app_data', {
          fixture: 'app_data.json',
        })
        TestHelpers.sizeParameters(size)
        cy.visit('/')
        TestHelpers.sizeCase(size, selection)
        TestHelpers.authenticate()
      })

      describe('successfully', () => {
        it('is expected to show information creation page', () => {
          cy.get('[data-cy=publish]').click()
          cy.get('[data-cy=pinned]').click()
          cy.get('[data-cy=header]').type('Covid 19 measures')
          cy.get('[data-cy=description]').type(
            'Some longer text to see that the body of the article creation is working correctly'
          )
          cy.get('[data-cy=link]').type('www.google.com')
          cy.get('[data-cy=info-submit]').click()
          cy.get('[data-cy=success-message]').should(
            'contain',
            'Your information snippet has successfully been created'
          )
        })
      })

      describe('unsuccessfully, by clicking `submit` btn', () => {
        beforeEach(() => {
          cy.intercept('POST', '**/information', {
            statusCode: 400,
            body: {
              error_message: 'An error occurred',
            },
          })
        })

        it('is expected to show error message', () => {
          cy.get('[data-cy=info-submit]').click()
          cy.get('[data-cy=snack-content]').should(
            'contain',
            'An error occurred'
          )
        })
      })
    })
  })
})
