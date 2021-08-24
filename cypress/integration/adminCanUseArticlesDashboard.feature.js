import sizes from '../support/index'

describe('admin can navigate to articles dashboard on ', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/articles', {
      fixture: 'all_articles.json',
    })
    cy.visit('/')
    cy.window().its('store').invoke('dispatch', {
      type: 'AUTHENTICATE',
      payload: 'Johhny Cage',
    })
    cy.visit('/articles')
  })

  sizes.forEach((size) => {
    context(`${size}`, () => {
      beforeEach(() => {
        if (Cypress._.isArray(size)) {
          cy.viewport(size[0], size[1])
        } else {
          cy.viewport(size)
        }
      })

      it('is expected to show a table with the list of all articles', () => {
        cy.get('[data-cy=articles-table]').within(() => {
          cy.get('[data-cy=article]')
            .should('have.length', 6)
            .first()
            .within(() => {
              cy.get('[data-cy=status]').should('be.visible')
              cy.get('[data-cy=title]').should(
                'contain.text',
                'Most recent article'
              )
              cy.get('[data-cy=author]').should('contain.text', 'Liu Kang')
              cy.get('[data-cy=date]').should('contain.text', '2021-05-12')
              cy.get('[data-cy=action]').scrollIntoView().should('be.visible')
            })
        })
      })
    })
  })
})
