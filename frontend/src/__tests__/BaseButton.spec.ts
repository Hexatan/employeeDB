import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../components/ui/BaseButton.vue'

describe('BaseButton', () => {
  describe('Rendering', () => {
    it('renders properly with default props', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Click me'
        }
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toBe('Click me')
      expect(wrapper.classes()).toContain('base-button')
      expect(wrapper.classes()).toContain('base-button--primary')
      expect(wrapper.classes()).toContain('base-button--medium')
    })

    it('renders slot content correctly', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: '<span>Custom Content</span>'
        }
      })

      expect(wrapper.html()).toContain('<span>Custom Content</span>')
    })
  })

  describe('Props - Variant', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline']

    variants.forEach(variant => {
      it(`applies correct class for ${variant} variant`, () => {
        const wrapper = mount(BaseButton, {
          props: { variant: variant as any },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain(`base-button--${variant}`)
      })
    })
  })

  describe('Props - Size', () => {
    const sizes = ['small', 'medium', 'large']

    sizes.forEach(size => {
      it(`applies correct class for ${size} size`, () => {
        const wrapper = mount(BaseButton, {
          props: { size: size as any },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain(`base-button--${size}`)
      })
    })
  })

  describe('Props - Disabled', () => {
    it('applies disabled class when disabled prop is true', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('base-button--disabled')
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('does not apply disabled class when disabled prop is false', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: false },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).not.toContain('base-button--disabled')
      expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
    })
  })

  describe('Props - Loading', () => {
    it('applies loading class and shows spinner when loading prop is true', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('base-button--loading')
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.base-button__spinner').exists()).toBe(true)
      expect(wrapper.text()).toBe('') // slot content should be hidden
    })

    it('does not show spinner when loading prop is false', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: false },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).not.toContain('base-button--loading')
      expect(wrapper.find('.base-button__spinner').exists()).toBe(false)
      expect(wrapper.text()).toBe('Button') // slot content should be visible
    })
  })

  describe('Event Handling', () => {
    it('emits click event when button is clicked', async () => {
      const wrapper = mount(BaseButton, {
        slots: { default: 'Button' }
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.emitted('click')![0][0]).toBeInstanceOf(MouseEvent)
    })

    it('does not emit click event when button is disabled', async () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click event when button is loading', async () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: { default: 'Button' }
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('handles click event with custom handler', async () => {
      const clickHandler = vi.fn()
      const wrapper = mount(BaseButton, {
        slots: { default: 'Button' }
      })

      wrapper.vm.$emit = vi.fn()
      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Combined Props', () => {
    it('applies multiple classes correctly', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'danger',
          size: 'large',
          disabled: true
        },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('base-button')
      expect(wrapper.classes()).toContain('base-button--danger')
      expect(wrapper.classes()).toContain('base-button--large')
      expect(wrapper.classes()).toContain('base-button--disabled')
    })

    it('handles loading and disabled states together', () => {
      const wrapper = mount(BaseButton, {
        props: {
          loading: true,
          disabled: true
        },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('base-button--loading')
      expect(wrapper.classes()).toContain('base-button--disabled')
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.base-button__spinner').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('maintains button semantics', () => {
      const wrapper = mount(BaseButton, {
        slots: { default: 'Button' }
      })

      expect(wrapper.find('button').element.tagName).toBe('BUTTON')
    })

    it('properly handles disabled state for screen readers', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })

      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })
  })
})
