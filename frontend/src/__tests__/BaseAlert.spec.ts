import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BaseAlert from '../components/ui/BaseAlert.vue'

describe('BaseAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Rendering', () => {
    it('renders properly with default props', () => {
      const wrapper = mount(BaseAlert)

      expect(wrapper.find('.base-alert').exists()).toBe(true)
      expect(wrapper.find('.base-alert').attributes('role')).toBe('alert')
      expect(wrapper.find('.base-alert').classes()).toContain('base-alert')
      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--default')
      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--bordered')
    })

    it('renders title when provided', () => {
      const wrapper = mount(BaseAlert, {
        props: { title: 'Alert Title' }
      })

      expect(wrapper.find('.base-alert__title').exists()).toBe(true)
      expect(wrapper.find('.base-alert__title').text()).toBe('Alert Title')
    })

    it('renders message when provided', () => {
      const wrapper = mount(BaseAlert, {
        props: { message: 'Alert message content' }
      })

      expect(wrapper.find('.base-alert__text').exists()).toBe(true)
      expect(wrapper.find('.base-alert__text').text()).toBe('Alert message content')
    })

    it('renders slot content instead of message prop', () => {
      const wrapper = mount(BaseAlert, {
        props: { message: 'Alert message content' },
        slots: {
          default: '<strong>Custom slot content</strong>'
        }
      })

      expect(wrapper.find('.base-alert__text').html()).toContain('<strong>Custom slot content</strong>')
      expect(wrapper.find('.base-alert__text').text()).not.toBe('Alert message content')
    })

    it('does not render when modelValue is false', () => {
      const wrapper = mount(BaseAlert, {
        props: { modelValue: false }
      })

      expect(wrapper.find('.base-alert').exists()).toBe(false)
    })
  })

  describe('Props - Variant', () => {
    const variants = ['default', 'success', 'warning', 'danger', 'info']

    variants.forEach(variant => {
      it(`applies correct class for ${variant} variant`, () => {
        const wrapper = mount(BaseAlert, {
          props: { variant: variant as any }
        })

        expect(wrapper.find('.base-alert').classes()).toContain(`base-alert--${variant}`)
      })
    })
  })

  describe('Props - Style Options', () => {
    it('applies dismissible class when dismissible prop is true', () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true }
      })

      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--dismissible')
      expect(wrapper.find('.base-alert__dismiss').exists()).toBe(true)
    })

    it('does not show dismiss button when dismissible is false', () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: false }
      })

      expect(wrapper.classes()).not.toContain('base-alert--dismissible')
      expect(wrapper.find('.base-alert__dismiss').exists()).toBe(false)
    })

    it('applies bordered class when bordered prop is true', () => {
      const wrapper = mount(BaseAlert, {
        props: { bordered: true }
      })

      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--bordered')
    })

    it('does not apply bordered class when bordered prop is false', () => {
      const wrapper = mount(BaseAlert, {
        props: { bordered: false }
      })

      expect(wrapper.find('.base-alert').classes()).not.toContain('base-alert--bordered')
    })

    it('applies filled class when filled prop is true', () => {
      const wrapper = mount(BaseAlert, {
        props: { filled: true }
      })

      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--filled')
    })

    it('does not apply filled class when filled prop is false', () => {
      const wrapper = mount(BaseAlert, {
        props: { filled: false }
      })

      expect(wrapper.find('.base-alert').classes()).not.toContain('base-alert--filled')
    })
  })

  describe('Props - Icon Display', () => {
    it('shows icon when showIcon prop is true', () => {
      const wrapper = mount(BaseAlert, {
        props: { showIcon: true }
      })

      expect(wrapper.find('.base-alert__icon').exists()).toBe(true)
    })

    it('does not show icon when showIcon prop is false', () => {
      const wrapper = mount(BaseAlert, {
        props: { showIcon: false }
      })

      expect(wrapper.find('.base-alert__icon').exists()).toBe(false)
    })

    it('shows correct default icon for success variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'success', showIcon: true }
      })

      expect(wrapper.find('.base-alert__icon').text()).toBe('✓')
    })

    it('shows correct default icon for warning variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'warning', showIcon: true }
      })

      expect(wrapper.find('.base-alert__icon').text()).toBe('⚠')
    })

    it('shows correct default icon for danger variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'danger', showIcon: true }
      })

      expect(wrapper.find('.base-alert__icon').text()).toBe('✕')
    })

    it('shows correct default icon for info variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'info', showIcon: true }
      })

      expect(wrapper.find('.base-alert__icon').text()).toBe('ℹ')
    })

    it('shows correct default icon for default variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'default', showIcon: true }
      })

      expect(wrapper.find('.base-alert__icon').text()).toBe('•')
    })

    it('renders custom icon slot content', () => {
      const wrapper = mount(BaseAlert, {
        props: { showIcon: true },
        slots: {
          icon: '<i class="custom-icon">🔥</i>'
        }
      })

      expect(wrapper.find('.base-alert__icon').html()).toContain('<i class="custom-icon">🔥</i>')
    })
  })

  describe('Slots', () => {
    it('renders actions slot when provided', () => {
      const wrapper = mount(BaseAlert, {
        slots: {
          actions: '<button class="custom-action">Action</button>'
        }
      })

      expect(wrapper.find('.base-alert__actions').exists()).toBe(true)
      expect(wrapper.find('.base-alert__actions').html()).toContain('<button class="custom-action">Action</button>')
    })

    it('does not render actions section when no actions slot provided', () => {
      const wrapper = mount(BaseAlert)

      expect(wrapper.find('.base-alert__actions').exists()).toBe(false)
    })
  })

  describe('Visibility and ModelValue', () => {
    it('shows alert when modelValue is true', () => {
      const wrapper = mount(BaseAlert, {
        props: { modelValue: true }
      })

      expect(wrapper.find('.base-alert').exists()).toBe(true)
    })

    it('hides alert when modelValue is false', () => {
      const wrapper = mount(BaseAlert, {
        props: { modelValue: false }
      })

      expect(wrapper.find('.base-alert').exists()).toBe(false)
    })

    it('updates visibility when modelValue prop changes', async () => {
      const wrapper = mount(BaseAlert, {
        props: { modelValue: true }
      })

      expect(wrapper.find('.base-alert').exists()).toBe(true)

      await wrapper.setProps({ modelValue: false })
      await nextTick()

      expect(wrapper.find('.base-alert').exists()).toBe(false)
    })

    it('emits update:modelValue when visibility changes', async () => {
      const wrapper = mount(BaseAlert, {
        props: { modelValue: true, dismissible: true }
      })

      await wrapper.find('.base-alert__dismiss').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })
  })

  describe('Dismiss Functionality', () => {
    it('emits dismiss event when dismiss button is clicked', async () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true }
      })

      await wrapper.find('.base-alert__dismiss').trigger('click')

      expect(wrapper.emitted('dismiss')).toBeTruthy()
      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })

    it('emits close event when alert is dismissed', async () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true }
      })

      await wrapper.find('.base-alert__dismiss').trigger('click')
      await nextTick()

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('hides alert when dismiss button is clicked', async () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true }
      })

      expect(wrapper.find('.base-alert').exists()).toBe(true)

      await wrapper.find('.base-alert__dismiss').trigger('click')
      await nextTick()

      expect(wrapper.find('.base-alert').exists()).toBe(false)
    })
  })

  describe('Auto Close Functionality', () => {
    it('auto closes after specified time', async () => {
      const wrapper = mount(BaseAlert, {
        props: { autoClose: 1000 }
      })

      expect(wrapper.find('.base-alert').exists()).toBe(true)

      // Fast forward time
      vi.advanceTimersByTime(1000)
      await nextTick()

      expect(wrapper.find('.base-alert').exists()).toBe(false)
      expect(wrapper.emitted('dismiss')).toBeTruthy()
    })

    it('does not auto close when autoClose is 0', async () => {
      const wrapper = mount(BaseAlert, {
        props: { autoClose: 0 }
      })

      expect(wrapper.find('.base-alert').exists()).toBe(true)

      // Fast forward time
      vi.advanceTimersByTime(5000)
      await nextTick()

      expect(wrapper.find('.base-alert').exists()).toBe(true)
      expect(wrapper.emitted('dismiss')).toBeFalsy()
    })

    it('emits dismiss and close events when auto closing', async () => {
      const wrapper = mount(BaseAlert, {
        props: { autoClose: 500 }
      })

      vi.advanceTimersByTime(500)
      await nextTick()

      expect(wrapper.emitted('dismiss')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('has proper role attribute', () => {
      const wrapper = mount(BaseAlert)

      expect(wrapper.find('.base-alert').attributes('role')).toBe('alert')
    })

    it('dismiss button has proper aria-label', () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true }
      })

      expect(wrapper.find('.base-alert__dismiss').attributes('aria-label')).toBe('Dismiss alert')
    })

    it('dismiss button has proper type attribute', () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true }
      })

      expect(wrapper.find('.base-alert__dismiss').attributes('type')).toBe('button')
    })
  })

  describe('Combined Props and Edge Cases', () => {
    it('handles all props together correctly', () => {
      const wrapper = mount(BaseAlert, {
        props: {
          variant: 'success',
          title: 'Success!',
          message: 'Operation completed successfully',
          dismissible: true,
          bordered: true,
          filled: true,
          showIcon: true,
          modelValue: true
        }
      })

      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--success')
      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--dismissible')
      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--bordered')
      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--filled')
      expect(wrapper.find('.base-alert__title').text()).toBe('Success!')
      expect(wrapper.find('.base-alert__text').text()).toBe('Operation completed successfully')
      expect(wrapper.find('.base-alert__icon').exists()).toBe(true)
      expect(wrapper.find('.base-alert__dismiss').exists()).toBe(true)
    })

    it('handles alert without title', () => {
      const wrapper = mount(BaseAlert, {
        props: { message: 'Just a message' }
      })

      expect(wrapper.find('.base-alert__title').exists()).toBe(false)
      expect(wrapper.find('.base-alert__text').text()).toBe('Just a message')
    })

    it('handles alert without message or slot content', () => {
      const wrapper = mount(BaseAlert, {
        props: { title: 'Just a title' }
      })

      expect(wrapper.find('.base-alert__title').text()).toBe('Just a title')
      expect(wrapper.find('.base-alert__text').exists()).toBe(true)
      expect(wrapper.find('.base-alert__text').text()).toBe('')
    })

    it('handles multiple style options together', () => {
      const wrapper = mount(BaseAlert, {
        props: {
          bordered: false,
          filled: true,
          dismissible: true
        }
      })

      expect(wrapper.find('.base-alert').classes()).not.toContain('base-alert--bordered')
      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--filled')
      expect(wrapper.find('.base-alert').classes()).toContain('base-alert--dismissible')
    })
  })
})
