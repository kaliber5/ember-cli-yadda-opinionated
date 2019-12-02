@setupApplicationTest
Feature: Then steps

Background:
  When I visit URL "/test-lab/then-steps"

Scenario: My scenario name
  Then I should be at URL "/test-lab/then-steps"
  Then I should be on URL "/test-lab/then-steps"
  Then I should still be at URL "/test-lab/then-steps"
  Then I should still be on URL "/test-lab/then-steps"
