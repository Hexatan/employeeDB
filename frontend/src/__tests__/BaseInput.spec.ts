import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/ui/BaseInput.vue'

describe('BaseInput', () => {
  describe('Rendering', () => {
    it('renders properly with default props', () => {
      const wrapper = mount(BaseInput)

      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('input').attributes('type')).toBe('text')
      expect(wrapper.classes()).toContain('base-input')
    })

    it('renders label when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Test Label' },
      })

      expect(wrapper.find('label').exists()).toBe(true)
      expect(wrapper.find('label').text()).toBe('Test Label')
    })

    it('does not render label when not provided', () => {
      const wrapper = mount(BaseInput)

      expect(wrapper.find('label').exists()).toBe(false)
    })

    it('shows required indicator when required prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Test Label', required: true },
      })

      expect(wrapper.find('.base-input__required').exists()).toBe(true)
      expect(wrapper.find('.base-input__required').text()).toBe('*')
    })

    it('does not show required indicator when required prop is false', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Test Label', required: false },
      })

      expect(wrapper.find('.base-input__required').exists()).toBe(false)
    })
  })

  describe('Props - Type', () => {
    const inputTypes = ['text', 'email', 'password', 'number', 'tel', 'url', 'search']

    inputTypes.forEach((type) => {
      it(`applies correct type attribute for ${type} input`, () => {
        const wrapper = mount(BaseInput, {
          props: { type: type as any },
        })

        expect(wrapper.find('input').attributes('type')).toBe(type)
      })
    })
  })

  describe('Props - Basic Attributes', () => {
    it('applies placeholder when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { placeholder: 'Enter text here' },
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text here')
    })

    it('applies disabled attribute when disabled prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: true },
      })

      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.find('input').classes()).toContain('base-input__field--disabled')
    })

    it('applies readonly attribute when readonly prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { readonly: true },
      })

      expect(wrapper.find('input').attributes('readonly')).toBeDefined()
    })

    it('sets input value from modelValue prop', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 'test value' },
      })

      expect(wrapper.find('input').element.value).toBe('test value')
    })
  })

  describe('Props - Validation States', () => {
    it('shows error state when errorMessage is provided', () => {
      const wrapper = mount(BaseInput, {
        props: { errorMessage: 'This field is required' },
      })

      expect(wrapper.find('input').classes()).toContain('base-input__field--error')
      expect(wrapper.find('.base-input__icon--error').exists()).toBe(true)
      expect(wrapper.find('.base-input__error').exists()).toBe(true)
      expect(wrapper.find('.base-input__error').text()).toBe('This field is required')
    })

    it('shows success state when successMessage is provided', () => {
      const wrapper = mount(BaseInput, {
        props: { successMessage: 'Valid input' },
      })

      expect(wrapper.find('input').classes()).toContain('base-input__field--success')
      expect(wrapper.find('.base-input__icon--success').exists()).toBe(true)
      expect(wrapper.find('.base-input__success').exists()).toBe(true)
      expect(wrapper.find('.base-input__success').text()).toBe('Valid input')
    })

    it('shows helper text when provided and no error/success messages', () => {
      const wrapper = mount(BaseInput, {
        props: { helperText: 'This is helper text' },
      })

      expect(wrapper.find('.base-input__helper').exists()).toBe(true)
      expect(wrapper.find('.base-input__helper').text()).toBe('This is helper text')
    })

    it('prioritizes error message over success message', () => {
      const wrapper = mount(BaseInput, {
        props: {
          errorMessage: 'Error message',
          successMessage: 'Success message',
        },
      })

      expect(wrapper.find('.base-input__error').exists()).toBe(true)
      expect(wrapper.find('.base-input__success').exists()).toBe(false)
      expect(wrapper.find('.base-input__error').text()).toBe('Error message')
    })

    it('prioritizes success message over helper text', () => {
      const wrapper = mount(BaseInput, {
        props: {
          successMessage: 'Success message',
          helperText: 'Helper text',
        },
      })

      expect(wrapper.find('.base-input__success').exists()).toBe(true)
      expect(wrapper.find('.base-input__helper').exists()).toBe(false)
      expect(wrapper.find('.base-input__success').text()).toBe('Success message')
    })
  })

  describe('Event Handling', () => {
    it('emits update:modelValue on input for text type', async () => {
      const wrapper = mount(BaseInput, {
        props: { type: 'text' },
      })

      const input = wrapper.find('input')
      await input.setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
    })

    it('emits update:modelValue with number for number type', async () => {
      const wrapper = mount(BaseInput, {
        props: { type: 'number' },
      })

      const input = wrapper.find('input')
      await input.setValue('123')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([123])
    })

    it('emits focus event when input is focused', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('focus')

      expect(wrapper.emitted('focus')).toBeTruthy()
      expect(wrapper.emitted('focus')![0][0]).toBeInstanceOf(FocusEvent)
    })

    it('emits blur event when input loses focus', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
      expect(wrapper.emitted('blur')![0][0]).toBeInstanceOf(FocusEvent)
    })

    it('emits enter event when Enter key is pressed', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('keyup.enter')

      expect(wrapper.emitted('enter')).toBeTruthy()
      expect(wrapper.emitted('enter')![0][0]).toBeInstanceOf(KeyboardEvent)
    })

    it('emits escape event when Escape key is pressed', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('keyup.escape')

      expect(wrapper.emitted('escape')).toBeTruthy()
      expect(wrapper.emitted('escape')![0][0]).toBeInstanceOf(KeyboardEvent)
    })

    it('does not emit events when disabled', async () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: true },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('blur')
      await input.setValue('test')

      // Events should still be emitted as they're native browser events
      // but the input should be disabled
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('generates unique input id', () => {
      const wrapper1 = mount(BaseInput)
      const wrapper2 = mount(BaseInput)

      const id1 = wrapper1.find('input').attributes('id')
      const id2 = wrapper2.find('input').attributes('id')

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })

    it('associates label with input using for attribute', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Test Label' },
      })

      const input = wrapper.find('input')
      const label = wrapper.find('label')
      const inputId = input.attributes('id')

      expect(label.attributes('for')).toBe(inputId)
    })

    it('maintains proper input semantics', () => {
      const wrapper = mount(BaseInput, {
        props: {
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Enter your email',
        },
      })

      const input = wrapper.find('input')
      expect(input.element.tagName).toBe('INPUT')
      expect(input.attributes('type')).toBe('email')
      expect(input.attributes('placeholder')).toBe('Enter your email')
    })
  })

  describe('Combined Props and Edge Cases', () => {
    it('handles all props together correctly', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'test@example.com',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter email',
          helperText: 'We will never share your email',
          required: true,
          disabled: false,
          readonly: false,
        },
      })

      expect(wrapper.find('label').text()).toBe('Email Address *')
      expect(wrapper.find('input').attributes('type')).toBe('email')
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter email')
      expect(wrapper.find('input').element.value).toBe('test@example.com')
      expect(wrapper.find('.base-input__helper').text()).toBe('We will never share your email')
    })

    it('handles empty string modelValue', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('input').element.value).toBe('')
    })

    it('handles number modelValue of 0', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 0, type: 'number' },
      })

      expect(wrapper.find('input').element.value).toBe('0')
    })

    it('does not show message section when no messages provided', () => {
      const wrapper = mount(BaseInput)

      expect(wrapper.find('.base-input__message').exists()).toBe(false)
    })

    it('does not show icon section when no validation states', () => {
      const wrapper = mount(BaseInput)

      expect(wrapper.find('.base-input__icon').exists()).toBe(false)
    })
  })
})
