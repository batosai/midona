<template>
  <Head :title="$t('login.title')" />

  <div class="flex items-center justify-center w-full min-h-screen">
    <Card>
      <template #title><h1>{{ $t('login.title') }}</h1></template>
      <template #content>
        <Form :resolver @submit="onFormSubmit" class="flex flex-col w-full gap-4 sm:w-80">
          <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
          <FormField v-slot="$field" name="redirectTo" :initialValue="tuyau.$route('drive.store').path" class="hidden">
            <InputText type="hidden" />
          </FormField>
          <FormField v-slot="$field" name="email" initialValue="" class="flex flex-col gap-1">
            <InputText type="email" size="large" :placeholder="$t('login.email')" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
          </FormField>
          <FormField v-slot="$field" name="password" initialValue="" class="flex flex-col gap-1">
            <Password type="text" size="large" :placeholder="$t('login.password')" :feedback="false" toggleMask fluid />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
          </FormField>
          <FormField v-slot="$field" name="rememberMe" initialValue="false" class="flex items-center gap-2">
            <Checkbox :binary="true" id="rememberMe" />
            <label for="rememberMe">{{ $t('login.rememberMe') }}</label>
          </FormField>
          <Button type="submit" :label="$t('login.submit')" />
        </Form>
      </template>
      <template #footer>
        <a href="#">{{ $t('login.forgotPassword') }}</a>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { tuyau } from '~/settings/tuyau'
import LoginLayout from '~/layouts/Login.vue'

defineOptions({ layout: LoginLayout })

const { t } = useI18n()
const error = ref('')

const resolver = zodResolver(
  z.object({
    email: z.string().email({ message: t('login.validation.email') }),
    password: z.string().min(1, { message: t('login.validation.password') }),
    rememberMe: z.boolean().optional().default(false),
    redirectTo: z.string().default(tuyau.drive.$url())
  })
)

const onFormSubmit = (event: FormSubmitEvent<Record<string, any>>) => {
  if (!event.valid) return
  error.value = ''

  router.post(tuyau.$route('auth.session.store').path, event.values, {
    onError: (errors) => {
      error.value = errors.E_INVALID_CREDENTIALS || errors.E_INVALID_DISABLED
    }
  })
}
</script>
