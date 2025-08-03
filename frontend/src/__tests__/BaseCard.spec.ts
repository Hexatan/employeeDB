import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from '../components/ui/BaseCard.vue'

describe('BaseCard', () => {
  describe('Rendering', () => {
    it('renders properly with default props', () => {
      const wrapper = mount(BaseCard)

      expect(wrapper.find('.base-card').exists()).toBe(true)
      expect(wrapper.classes()).toContain('base-card')
      expect(wrapper.classes()).toContain('base-card--default')
      expect(wrapper.classes()).toContain('base-card--bordered')
      expect(wrapper.classes()).toContain('base-card--shadow')
    })

    it('renders title when provided', () => {
      const wrapper = mount(BaseCard, {
        props: { title: 'Card Title' }
      })

      expect(wrapper.find('.base-card__header').exists()).toBe(true)
      expect(wrapper.find('.base-card__title').exists()).toBe(true)
      expect(wrapper.find('.base-card__title').text()).toBe('Card Title')
    })

    it('renders subtitle when provided', () => {
      const wrapper = mount(BaseCard, {
        props: { subtitle: 'Card Subtitle' }
      })

      expect(wrapper.find('.base-card__header').exists()).toBe(true)
      expect(wrapper.find('.base-card__subtitle').exists()).toBe(true)
      expect(wrapper.find('.base-card__subtitle').text()).toBe('Card Subtitle')
    })

    it('renders both title and subtitle when provided', () => {
      const wrapper = mount(BaseCard, {
        props: {
          title: 'Card Title',
          subtitle: 'Card Subtitle'
        }
      })

      expect(wrapper.find('.base-card__title').text()).toBe('Card Title')
      expect(wrapper.find('.base-card__subtitle').text()).toBe('Card Subtitle')
    })

    it('does not render header when no title, subtitle, or header slot provided', () => {
      const wrapper = mount(BaseCard)

      expect(wrapper.find('.base-card__header').exists()).toBe(false)
    })

    it('does not render body when no default slot provided', () => {
      const wrapper = mount(BaseCard)

      expect(wrapper.find('.base-card__body').exists()).toBe(false)
    })

    it('does not render footer when no footer slot provided', () => {
      const wrapper = mount(BaseCard)

      expect(wrapper.find('.base-card__footer').exists()).toBe(false)
    })
  })

  describe('Props - Variant', () => {
    const variants = ['default', 'primary', 'success', 'warning', 'danger', 'info']

    variants.forEach(variant => {
      it(`applies correct class for ${variant} variant`, () => {
        const wrapper = mount(BaseCard, {
          props: { variant: variant as any }
        })

        expect(wrapper.classes()).toContain(`base-card--${variant}`)
      })
    })
  })

  describe('Props - Interactive States', () => {
    it('applies hoverable class when hoverable prop is true', () => {
      const wrapper = mount(BaseCard, {
        props: { hoverable: true }
      })

      expect(wrapper.classes()).toContain('base-card--hoverable')
    })

    it('does not apply hoverable class when hoverable prop is false', () => {
      const wrapper = mount(BaseCard, {
        props: { hoverable: false }
      })

      expect(wrapper.classes()).not.toContain('base-card--hoverable')
    })

    it('applies clickable class when clickable prop is true', () => {
      const wrapper = mount(BaseCard, {
        props: { clickable: true }
      })

      expect(wrapper.classes()).toContain('base-card--clickable')
    })

    it('does not apply clickable class when clickable prop is false', () => {
      const wrapper = mount(BaseCard, {
        props: { clickable: false }
      })

      expect(wrapper.classes()).not.toContain('base-card--clickable')
    })
  })

  describe('Props - Style Options', () => {
    it('applies bordered class when bordered prop is true', () => {
      const wrapper = mount(BaseCard, {
        props: { bordered: true }
      })

      expect(wrapper.classes()).toContain('base-card--bordered')
    })

    it('does not apply bordered class when bordered prop is false', () => {
      const wrapper = mount(BaseCard, {
        props: { bordered: false }
      })

      expect(wrapper.classes()).not.toContain('base-card--bordered')
    })

    it('applies shadow class when shadow prop is true', () => {
      const wrapper = mount(BaseCard, {
        props: { shadow: true }
      })

      expect(wrapper.classes()).toContain('base-card--shadow')
    })

    it('does not apply shadow class when shadow prop is false', () => {
      const wrapper = mount(BaseCard, {
        props: { shadow: false }
      })

      expect(wrapper.classes()).not.toContain('base-card--shadow')
    })
  })

  describe('Slots', () => {
    it('renders default slot content in body', () => {
      const wrapper = mount(BaseCard, {
        slots: {
          default: '<p>Card body content</p>'
        }
      })

      expect(wrapper.find('.base-card__body').exists()).toBe(true)
      expect(wrapper.find('.base-card__body').html()).toContain('<p>Card body content</p>')
    })

    it('renders custom header slot content', () => {
      const wrapper = mount(BaseCard, {
        slots: {
          header: '<div class="custom-header">Custom Header</div>'
        }
      })

      expect(wrapper.find('.base-card__header').exists()).toBe(true)
      expect(wrapper.find('.base-card__header').html()).toContain('<div class="custom-header">Custom Header</div>')
    })

    it('renders actions slot content', () => {
      const wrapper = mount(BaseCard, {
        props: { title: 'Card Title' },
        slots: {
          actions: '<button class="custom-action">Action</button>'
        }
      })

      expect(wrapper.find('.base-card__actions').exists()).toBe(true)
      expect(wrapper.find('.base-card__actions').html()).toContain('<button class="custom-action">Action</button>')
    })

    it('renders footer slot content', () => {
      const wrapper = mount(BaseCard, {
        slots: {
          footer: '<div class="custom-footer">Footer content</div>'
        }
      })

      expect(wrapper.find('.base-card__footer').exists()).toBe(true)
      expect(wrapper.find('.base-card__footer').html()).toContain('<div class="custom-footer">Footer content</div>')
    })

    it('does not render actions section when no actions slot and no header', () => {
      const wrapper = mount(BaseCard)

      expect(wrapper.find('.base-card__actions').exists()).toBe(false)
    })

    it('renders actions section only when actions slot is provided with header', () => {
      const wrapper = mount(BaseCard, {
        props: { title: 'Title' },
        slots: {
          actions: '<button>Action</button>'
        }
      })

      expect(wrapper.find('.base-card__actions').exists()).toBe(true)
    })

    it('prioritizes custom header slot over title/subtitle props', () => {
      const wrapper = mount(BaseCard, {
        props: {
          title: 'Prop Title',
          subtitle: 'Prop Subtitle'
        },
        slots: {
          header: '<div class="custom-header">Custom Header</div>'
        }
      })

      expect(wrapper.find('.custom-header').exists()).toBe(true)
      expect(wrapper.find('.base-card__title').exists()).toBe(false)
      expect(wrapper.find('.base-card__subtitle').exists()).toBe(false)
    })
  })

  describe('Click Handling', () => {
    it('emits click event when card is clicked and clickable is true', async () => {
      const wrapper = mount(BaseCard, {
        props: { clickable: true }
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.emitted('click')![0][0]).toBeInstanceOf(MouseEvent)
    })

    it('does not emit click event when card is clicked and clickable is false', async () => {
      const wrapper = mount(BaseCard, {
        props: { clickable: false }
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click event when clickable prop is not set', async () => {
      const wrapper = mount(BaseCard)

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('handles click event with proper MouseEvent', async () => {
      const wrapper = mount(BaseCard, {
        props: { clickable: true }
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0][0]).toBeInstanceOf(MouseEvent)
    })
  })

  describe('Combined Props and Edge Cases', () => {
    it('handles all props together correctly', () => {
      const wrapper = mount(BaseCard, {
        props: {
          title: 'Test Title',
          subtitle: 'Test Subtitle',
          variant: 'primary',
          hoverable: true,
          clickable: true,
          bordered: true,
          shadow: true
        }
      })

      expect(wrapper.classes()).toContain('base-card--primary')
      expect(wrapper.classes()).toContain('base-card--hoverable')
      expect(wrapper.classes()).toContain('base-card--clickable')
      expect(wrapper.classes()).toContain('base-card--bordered')
      expect(wrapper.classes()).toContain('base-card--shadow')
      expect(wrapper.find('.base-card__title').text()).toBe('Test Title')
      expect(wrapper.find('.base-card__subtitle').text()).toBe('Test Subtitle')
    })

    it('handles card with all slots', () => {
      const wrapper = mount(BaseCard, {
        slots: {
          header: '<div class="custom-header">Header</div>',
          default: '<div class="custom-body">Body</div>',
          footer: '<div class="custom-footer">Footer</div>',
          actions: '<button class="custom-action">Action</button>'
        }
      })

      expect(wrapper.find('.base-card__header').exists()).toBe(true)
      expect(wrapper.find('.base-card__body').exists()).toBe(true)
      expect(wrapper.find('.base-card__footer').exists()).toBe(true)
      expect(wrapper.find('.base-card__actions').exists()).toBe(true)
    })

    it('handles card without any styling options', () => {
      const wrapper = mount(BaseCard, {
        props: {
          bordered: false,
          shadow: false,
          hoverable: false,
          clickable: false
        }
      })

      expect(wrapper.classes()).not.toContain('base-card--bordered')
      expect(wrapper.classes()).not.toContain('base-card--shadow')
      expect(wrapper.classes()).not.toContain('base-card--hoverable')
      expect(wrapper.classes()).not.toContain('base-card--clickable')
    })

    it('handles empty title and subtitle strings', () => {
      const wrapper = mount(BaseCard, {
        props: {
          title: '',
          subtitle: ''
        }
      })

      // Empty strings are falsy, so elements should not render
      expect(wrapper.find('.base-card__header').exists()).toBe(false)
      expect(wrapper.find('.base-card__title').exists()).toBe(false)
      expect(wrapper.find('.base-card__subtitle').exists()).toBe(false)
    })

    it('handles interactive states together', () => {
      const wrapper = mount(BaseCard, {
        props: {
          hoverable: true,
          clickable: true
        }
      })

      expect(wrapper.classes()).toContain('base-card--hoverable')
      expect(wrapper.classes()).toContain('base-card--clickable')
    })

    it('handles different variants with interactive states', () => {
      const wrapper = mount(BaseCard, {
        props: {
          variant: 'success',
          hoverable: true,
          clickable: true
        }
      })

      expect(wrapper.classes()).toContain('base-card--success')
      expect(wrapper.classes()).toContain('base-card--hoverable')
      expect(wrapper.classes()).toContain('base-card--clickable')
    })
  })

  describe('Accessibility and Semantics', () => {
    it('uses proper heading tag for title', () => {
      const wrapper = mount(BaseCard, {
        props: { title: 'Card Title' }
      })

      const titleElement = wrapper.find('.base-card__title')
      expect(titleElement.element.tagName).toBe('H3')
    })

    it('uses proper paragraph tag for subtitle', () => {
      const wrapper = mount(BaseCard, {
        props: { subtitle: 'Card Subtitle' }
      })

      const subtitleElement = wrapper.find('.base-card__subtitle')
      expect(subtitleElement.element.tagName).toBe('P')
    })

    it('maintains proper structure with header, body, and footer', () => {
      const wrapper = mount(BaseCard, {
        props: { title: 'Title' },
        slots: {
          default: 'Body content',
          footer: 'Footer content'
        }
      })

      const card = wrapper.find('.base-card')
      const header = card.find('.base-card__header')
      const body = card.find('.base-card__body')
      const footer = card.find('.base-card__footer')

      expect(header.exists()).toBe(true)
      expect(body.exists()).toBe(true)
      expect(footer.exists()).toBe(true)

      // Check order
      const children = card.element.children
      expect(children[0]).toBe(header.element)
      expect(children[1]).toBe(body.element)
      expect(children[2]).toBe(footer.element)
    })
  })
})
