<template>

  <Splitter class="bg-transparent border-0 size-full">
    <SplitterPanel :size="20" class="flex items-center justify-center">
      <Menu :model="items" class="bg-transparent border-0 size-full" />
    </SplitterPanel>
    <SplitterPanel :size="80" class="flex items-center justify-center">
      <div class="flex items-center justify-center w-full min-h-screen">
        <Fieldset legend="Profile" pt:content:class="flex justify-center">
          <Form :initialValues :resolver @submit="onFormSubmit" class="flex flex-col w-full gap-4 sm:w-80">
            <FormField v-slot="$field" name="email" initialValue="" class="flex flex-col gap-1">
              <InputText type="email" placeholder="Email" />
              <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="firstname" initialValue="" class="flex flex-col gap-1">
              <InputText type="text" placeholder="First Name" />
              <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="lastname" initialValue="" class="flex flex-col gap-1">
              <InputText type="text" placeholder="Last Name" />
              <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="password" initialValue="" class="flex flex-col gap-1">
              <Password type="text" placeholder="Password" toggleMask fluid />
              <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
            </FormField>
            <Button type="submit" severity="secondary" label="Submit" />
          </Form>
        </Fieldset>
      </div>
    </SplitterPanel>
  </Splitter>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form, FormField } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const initialValues = ref({
    email: '',
    firstname: '',
    lastname: '',
    password: ''
})

const resolver = zodResolver(
  z.object({
    email: z.string().email({ message: "Invalid email address" }),
    firstname: z.string().min(1, { message: 'Firstname is required' }),
    lastname: z.string().min(1, { message: 'Lastname is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
  })
)

const onFormSubmit = ({ valid }) => {

}

const items = ref([
  {
    label: 'Router Link',
    icon: 'pi pi-palette',
    url: '/'
  },
  {
    label: 'Programmatic',
    icon: 'pi pi-link',
    command: () => {}
  },
  {
    label: 'External',
    icon: 'pi pi-home',
    url: 'https://vuejs.org/'
  }
])
</script>
