<template>
  <Head title="Settings" />

  <Splitter class="bg-transparent border-0 size-full">
    <SplitterPanel :size="25" class="bg-surface-200 dark:bg-surface-800">
      <h1 class="p-4 mt-24 text-2xl">Settings</h1>
      <Menu :model="items" class="w-full text-xl bg-transparent border-0" />
    </SplitterPanel>
    <SplitterPanel :size="75" class="flex items-center justify-center">
      <div class="flex items-center justify-center w-full min-h-screen">
        <Card>
          <template #title>Profile</template>
          <template #content>
            <Form id="profile" :initialValues :resolver @submit="onFormSubmit" class="grid gap-4 sm:grid-cols-2">
              <FormField v-slot="$field" name="firstname" initialValue="" class="flex flex-col gap-1">
                <InputText type="text" placeholder="First Name" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>
              <FormField v-slot="$field" name="lastname" initialValue="" class="flex flex-col gap-1">
                <InputText type="text" placeholder="Last Name" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>
              <FormField v-slot="$field" name="email" initialValue="" class="flex flex-col gap-1">
                <InputText type="email" placeholder="Email" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>
              <FormField v-slot="$field" name="password" initialValue="" class="flex flex-col gap-1">
                <Password type="text" placeholder="Password" toggleMask fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>
            </Form>
          </template>
          <template #footer>
            <Button type="submit" form="profile" class="w-full mt-2" label="Submit" />
          </template>
        </Card>
      </div>
    </SplitterPanel>
  </Splitter>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Head } from '@inertiajs/vue3'
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
    label: 'Administrator',
    items: [
      {
        label: 'Users',
        icon: 'pi pi-users'
      },
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Informations',
        icon: 'pi pi-user'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        // url: tuyau.$route('settings').path
        command: () => router.visit(tuyau.$route('settings').path)
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out'
      }
    ]
    }
])
</script>
