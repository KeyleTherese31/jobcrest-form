<template>
    <div>
      <label>{{ label }}</label>
      <input v-model="local.label" placeholder="Question label" />
      <select v-model="local.type">
        <option value="text">Text</option>
        <option value="textarea">Textarea</option>
      </select>
      <label>Required:</label>
      <input type="checkbox" v-model="local.required" />
    </div>
  </template>
  
  <script>
  export default {
    props: ['value'],
    data() {
      return {
        local: { ...this.value }
      }
    },
    watch: {
      local: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true
      }
    }
  }
  </script>
  