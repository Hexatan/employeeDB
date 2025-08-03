import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import type { LoadingVariant, ComponentSize, SpinnerType } from '@/components/ui'

describe('BaseLoading', () => {
  describe('Rendering', () => {
    it('renders properly with default props', () => {
      const wrapper = mount(BaseLoading)

      expect(wrapper.find('.base-loading').exists()).toBe(true)
      expect(wrapper.classes()).toContain('base-loading')
      expect(wrapper.classes()).toContain('base-loading--primary')
      expect(wrapper.find('.base-loading__content').exists()).toBe(true)
      expect(wrapper.find('.base-loading__spinner').exists()).toBe(true)
    })

    it('renders loading text when provided', () => {
      const wrapper = mount(BaseLoading, {
        props: { text: 'Loading...' },
      })

      expect(wrapper.find('.base-loading__text').exists()).toBe(true)
      expect(wrapper.find('.base-loading__text').text()).toBe('Loading...')
    })

    it('does not render text element when no text provided', () => {
      const wrapper = mount(BaseLoading)

      expect(wrapper.find('.base-loading__text').exists()).toBe(false)
    })

    it('renders custom slot content', () => {
      const wrapper = mount(BaseLoading, {
        slots: {
          default: '<div class="custom-content">Custom loading content</div>',
        },
      })

      expect(wrapper.find('.base-loading__custom').exists()).toBe(true)
      expect(wrapper.find('.base-loading__custom').html()).toContain(
        '<div class="custom-content">Custom loading content</div>',
      )
    })

    it('does not render custom content section when no slot provided', () => {
      const wrapper = mount(BaseLoading)

      expect(wrapper.find('.base-loading__custom').exists()).toBe(false)
    })
  })

  describe('Props - Variant', () => {
    const variants: LoadingVariant[] = ['light', 'dark', 'primary']

    variants.forEach((variant) => {
      it(`applies correct class for ${variant} variant`, () => {
        const wrapper = mount(BaseLoading, {
          props: { variant },
        })

        expect(wrapper.classes()).toContain(`base-loading--${variant}`)
      })
    })
  })

  describe('Props - Size', () => {
    const sizes: ComponentSize[] = ['small', 'medium', 'large']

    sizes.forEach((size) => {
      it(`applies correct class for ${size} size`, () => {
        const wrapper = mount(BaseLoading, {
          props: { size },
        })

        expect(wrapper.find('.base-loading__spinner').classes()).toContain(
          `base-loading__spinner--${size}`,
        )
      })
    })
  })

  describe('Props - Spinner Type', () => {
    it('renders circle spinner by default', () => {
      const wrapper = mount(BaseLoading)

      expect(wrapper.find('.base-loading__spinner').classes()).toContain(
        'base-loading__spinner--circle',
      )
      expect(wrapper.find('.base-loading__circle').exists()).toBe(true)
      expect(wrapper.find('.base-loading__dots').exists()).toBe(false)
      expect(wrapper.find('.base-loading__pulse').exists()).toBe(false)
    })

    it('renders circle spinner when spinnerType is circle', () => {
      const wrapper = mount(BaseLoading, {
        props: { spinnerType: 'circle' },
      })

      expect(wrapper.find('.base-loading__spinner').classes()).toContain(
        'base-loading__spinner--circle',
      )
      expect(wrapper.find('.base-loading__circle').exists()).toBe(true)
      expect(wrapper.find('.base-loading__dots').exists()).toBe(false)
      expect(wrapper.find('.base-loading__pulse').exists()).toBe(false)
    })

    it('renders dots spinner when spinnerType is dots', () => {
      const wrapper = mount(BaseLoading, {
        props: { spinnerType: 'dots' },
      })

      expect(wrapper.find('.base-loading__spinner').classes()).toContain(
        'base-loading__spinner--dots',
      )
      expect(wrapper.find('.base-loading__dots').exists()).toBe(true)
      expect(wrapper.find('.base-loading__circle').exists()).toBe(false)
      expect(wrapper.find('.base-loading__pulse').exists()).toBe(false)
    })

    it('renders pulse spinner when spinnerType is pulse', () => {
      const wrapper = mount(BaseLoading, {
        props: { spinnerType: 'pulse' },
      })

      expect(wrapper.find('.base-loading__spinner').classes()).toContain(
        'base-loading__spinner--pulse',
      )
      expect(wrapper.find('.base-loading__pulse').exists()).toBe(true)
      expect(wrapper.find('.base-loading__circle').exists()).toBe(false)
      expect(wrapper.find('.base-loading__dots').exists()).toBe(false)
    })

    it('renders three dots for dots spinner', () => {
      const wrapper = mount(BaseLoading, {
        props: { spinnerType: 'dots' },
      })

      const dots = wrapper.findAll('.base-loading__dot')
      expect(dots).toHaveLength(3)
    })
  })

  describe('Props - Display Modes', () => {
    it('applies overlay class when overlay prop is true', () => {
      const wrapper = mount(BaseLoading, {
        props: { overlay: true },
      })

      expect(wrapper.classes()).toContain('base-loading--overlay')
    })

    it('does not apply overlay class when overlay prop is false', () => {
      const wrapper = mount(BaseLoading, {
        props: { overlay: false },
      })

      expect(wrapper.classes()).not.toContain('base-loading--overlay')
    })

    it('applies fullscreen class when fullscreen prop is true', () => {
      const wrapper = mount(BaseLoading, {
        props: { fullscreen: true },
      })

      expect(wrapper.classes()).toContain('base-loading--fullscreen')
    })

    it('does not apply fullscreen class when fullscreen prop is false', () => {
      const wrapper = mount(BaseLoading, {
        props: { fullscreen: false },
      })

      expect(wrapper.classes()).not.toContain('base-loading--fullscreen')
    })

    it('can apply both overlay and fullscreen classes', () => {
      const wrapper = mount(BaseLoading, {
        props: {
          overlay: true,
          fullscreen: true,
        },
      })

      expect(wrapper.classes()).toContain('base-loading--overlay')
      expect(wrapper.classes()).toContain('base-loading--fullscreen')
    })
  })

  describe('Combined Props and Edge Cases', () => {
    it('handles all props together correctly', () => {
      const wrapper = mount(BaseLoading, {
        props: {
          variant: 'dark',
          size: 'large',
          spinnerType: 'dots',
          text: 'Please wait...',
          overlay: true,
          fullscreen: false,
        },
      })

      expect(wrapper.classes()).toContain('base-loading--dark')
      expect(wrapper.classes()).toContain('base-loading--overlay')
      expect(wrapper.classes()).not.toContain('base-loading--fullscreen')
      expect(wrapper.find('.base-loading__spinner').classes()).toContain(
        'base-loading__spinner--large',
      )
      expect(wrapper.find('.base-loading__spinner').classes()).toContain(
        'base-loading__spinner--dots',
      )
      expect(wrapper.find('.base-loading__dots').exists()).toBe(true)
      expect(wrapper.find('.base-loading__text').text()).toBe('Please wait...')
    })

    it('handles different spinner types with different sizes', () => {
      const wrapper = mount(BaseLoading, {
        props: {
          spinnerType: 'pulse',
          size: 'small',
        },
      })

      expect(wrapper.find('.base-loading__spinner').classes()).toContain(
        'base-loading__spinner--small',
      )
      expect(wrapper.find('.base-loading__spinner').classes()).toContain(
        'base-loading__spinner--pulse',
      )
      expect(wrapper.find('.base-loading__pulse').exists()).toBe(true)
    })

    it('handles empty text string', () => {
      const wrapper = mount(BaseLoading, {
        props: { text: '' },
      })

      // Empty string is falsy, so text element should not render
      expect(wrapper.find('.base-loading__text').exists()).toBe(false)
    })

    it('handles text and custom slot together', () => {
      const wrapper = mount(BaseLoading, {
        props: { text: 'Loading data...' },
        slots: {
          default: '<div class="progress-bar">50%</div>',
        },
      })

      expect(wrapper.find('.base-loading__text').exists()).toBe(true)
      expect(wrapper.find('.base-loading__text').text()).toBe('Loading data...')
      expect(wrapper.find('.base-loading__custom').exists()).toBe(true)
      expect(wrapper.find('.base-loading__custom').html()).toContain(
        '<div class="progress-bar">50%</div>',
      )
    })

    it('handles all spinner types with all variants', () => {
      const spinnerTypes: SpinnerType[] = ['circle', 'dots', 'pulse']
      const variants: LoadingVariant[] = ['light', 'dark', 'primary']

      spinnerTypes.forEach((spinnerType) => {
        variants.forEach((variant) => {
          const wrapper = mount(BaseLoading, {
            props: {
              spinnerType,
              variant,
            },
          })

          expect(wrapper.classes()).toContain(`base-loading--${variant}`)
          expect(wrapper.find('.base-loading__spinner').classes()).toContain(
            `base-loading__spinner--${spinnerType}`,
          )
        })
      })
    })

    it('handles all sizes with all spinner types', () => {
      const sizes: ComponentSize[] = ['small', 'medium', 'large']
      const spinnerTypes: SpinnerType[] = ['circle', 'dots', 'pulse']

      sizes.forEach((size) => {
        spinnerTypes.forEach((spinnerType) => {
          const wrapper = mount(BaseLoading, {
            props: {
              size,
              spinnerType,
            },
          })

          expect(wrapper.find('.base-loading__spinner').classes()).toContain(
            `base-loading__spinner--${size}`,
          )
          expect(wrapper.find('.base-loading__spinner').classes()).toContain(
            `base-loading__spinner--${spinnerType}`,
          )
        })
      })
    })
  })

  describe('Structure and Layout', () => {
    it('maintains proper content structure', () => {
      const wrapper = mount(BaseLoading, {
        props: { text: 'Loading...' },
        slots: {
          default: '<div>Custom content</div>',
        },
      })

      const content = wrapper.find('.base-loading__content')
      expect(content.exists()).toBe(true)

      const spinner = content.find('.base-loading__spinner')
      const text = content.find('.base-loading__text')
      const custom = content.find('.base-loading__custom')

      expect(spinner.exists()).toBe(true)
      expect(text.exists()).toBe(true)
      expect(custom.exists()).toBe(true)

      // Check order: spinner should come first, then text, then custom content
      const children = content.element.children
      expect(children[0]).toBe(spinner.element)
      expect(children[1]).toBe(text.element)
      expect(children[2]).toBe(custom.element)
    })

    it('maintains proper structure with only spinner', () => {
      const wrapper = mount(BaseLoading)

      const content = wrapper.find('.base-loading__content')
      const spinner = content.find('.base-loading__spinner')

      expect(content.exists()).toBe(true)
      expect(spinner.exists()).toBe(true)
      expect(content.element.children).toHaveLength(1)
      expect(content.element.children[0]).toBe(spinner.element)
    })

    it('maintains proper structure with spinner and text only', () => {
      const wrapper = mount(BaseLoading, {
        props: { text: 'Loading...' },
      })

      const content = wrapper.find('.base-loading__content')
      const spinner = content.find('.base-loading__spinner')
      const text = content.find('.base-loading__text')

      expect(content.exists()).toBe(true)
      expect(spinner.exists()).toBe(true)
      expect(text.exists()).toBe(true)
      expect(content.element.children).toHaveLength(2)
      expect(content.element.children[0]).toBe(spinner.element)
      expect(content.element.children[1]).toBe(text.element)
    })

    it('maintains proper structure with spinner and custom content only', () => {
      const wrapper = mount(BaseLoading, {
        slots: {
          default: '<div>Custom content</div>',
        },
      })

      const content = wrapper.find('.base-loading__content')
      const spinner = content.find('.base-loading__spinner')
      const custom = content.find('.base-loading__custom')

      expect(content.exists()).toBe(true)
      expect(spinner.exists()).toBe(true)
      expect(custom.exists()).toBe(true)
      expect(content.element.children).toHaveLength(2)
      expect(content.element.children[0]).toBe(spinner.element)
      expect(content.element.children[1]).toBe(custom.element)
    })
  })

  describe('Accessibility and Semantics', () => {
    it('provides proper loading indication structure', () => {
      const wrapper = mount(BaseLoading, {
        props: { text: 'Loading data...' },
      })

      expect(wrapper.find('.base-loading').exists()).toBe(true)
      expect(wrapper.find('.base-loading__content').exists()).toBe(true)
      expect(wrapper.find('.base-loading__spinner').exists()).toBe(true)
      expect(wrapper.find('.base-loading__text').exists()).toBe(true)
    })

    it('maintains semantic structure for screen readers', () => {
      const wrapper = mount(BaseLoading, {
        props: { text: 'Please wait while we load your data' },
      })

      const text = wrapper.find('.base-loading__text')
      expect(text.text()).toBe('Please wait while we load your data')
    })
  })
})
