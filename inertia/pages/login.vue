<template>
  <div class="flex items-center justify-center w-full min-h-screen">
    <Card>
      <template #header><h1>Login</h1></template>
      <template #content>
        <Form :resolver @submit="onFormSubmit" class="flex flex-col w-full gap-4 sm:w-80">
          <FormField v-slot="$field" name="email" initialValue="" class="flex flex-col gap-1">
            <InputText type="email" placeholder="Email" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
          </FormField>
          <FormField v-slot="$field" name="password" initialValue="" class="flex flex-col gap-1">
            <Password type="text" placeholder="Password" :feedback="false" toggleMask fluid />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
          </FormField>
          <Button type="submit" severity="secondary" label="Submit" />
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Form, FormField } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import LoginLayout from '~/layouts/Login.vue'

defineOptions({ layout: LoginLayout })

const resolver = zodResolver(
  z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: 'Password is required' }),
  })
)

const onFormSubmit = ({ valid }) => {

}
</script>
