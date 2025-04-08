<template>
    <div class="container mt-4">
      <h2 v-if="isEditing" class="mb-4">Edit Question</h2>
      <h2 v-else class="mb-4">Create New Question</h2>
  
      <form @submit.prevent="saveQuestion">
        <div class="form-group">
          <label>Test Type</label>
          <select v-model="question.testType" class="form-control" required>
            <option v-for="test in tests" :key="test.id" :value="test.id">{{ test.name }}</option>
          </select>
        </div>
  
        <div class="form-group">
          <label>Question Type</label>
          <select v-model="question.type" class="form-control" required>
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>
  
        <div class="form-group">
          <label>Question Label</label>
          <input v-model="question.label" class="form-control" placeholder="Enter question" required />
        </div>
  
        <div v-if="question.type === 'text'" class="form-group">
          <label>Question Format</label>
          <select v-model="question.format" class="form-control" required>
            <option value="multipleChoice">Multiple Choice</option>
            <option value="trueFalse">True/False</option>
            <option value="shortAnswer">Short Answer</option>
            <option value="longAnswer">Long Answer</option>
          </select>
        </div>
  
        <div v-if="question.format === 'multipleChoice'" class="form-group">
          <label>Choices (separate with commas)</label>
          <input v-model="question.choices" class="form-control" placeholder="Enter choices" />
        </div>
  
        <div v-if="question.type === 'image'" class="form-group">
          <label>Image</label>
          <input type="file" @change="onImageUpload" class="form-control-file" />
          <div v-if="question.image" class="mt-2">
            <img :src="question.image" class="img-thumbnail" style="max-width: 200px;" />
          </div>
        </div>
  
        <button type="submit" class="btn btn-primary mt-3">{{ isEditing ? 'Save Changes' : 'Create Question' }}</button>
      </form>
  
      <div v-if="isEditing" class="mt-4">
        <button @click="deleteQuestion" class="btn btn-danger">
          Delete Question
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { createClient } from '@supabase/supabase-js'
  import { v4 as uuidv4 } from 'uuid'
  
  const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
  const supabaseKey = process.env.VUE_APP_SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  export default {
    data() {
      return {
        isEditing: false,
        question: {
          id: null,
          label: '',
          type: 'text',
          format: 'multipleChoice',
          image: '',
          choices: '',
          testType: 'pattern'
        },
        tests: [
          { name: 'Test 1: Image Pattern Analysis', id: 'pattern' },
          { name: 'Test 2: Basic Math', id: 'math' },
          { name: 'Test 3: Numerical Form', id: 'math2' },
          { name: 'Test 4: Reading Comprehension', id: 'read' },
          { name: 'Pre Interview Questionaire', id: 'pretf' },
          { name: 'Sentence Completion', id: 'sentcomp' }
        ]
      }
    },
    async mounted() {
      const testType = this.$route.params.testType
      const index = this.$route.params.index
  
      if (testType && index !== undefined) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('test_type', testType)
  
        if (!error && data && data[index]) {
          this.isEditing = true
          this.question = {
            id: data[index].id,
            label: data[index].label,
            type: data[index].type,
            format: data[index].format,
            image: data[index].image_url,
            choices: data[index].choices,
            testType: data[index].test_type
          }
        }
      }
    },
    methods: {
      async onImageUpload(e) {
        const file = e.target.files[0]
        if (!file) return
  
        const fileName = `question-images/${uuidv4()}`
        const { error } = await supabase.storage.from('images').upload(fileName, file)
  
        if (error) {
          alert('Failed to upload image')
          return
        }
  
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
        this.question.image = urlData.publicURL
      },
  
      async saveQuestion() {
  const { id, label, type, format, choices, image, testType } = this.question;

  let response;
  if (this.isEditing && id) {
    response = await supabase
      .from('questions')
      .update({ label, type, format, choices, image_url: image || null, test_type: testType })
      .eq('id', id);
  } else {
    response = await supabase
      .from('questions')
      .insert([{ label, type, format, choices, image_url: image || null, test_type: testType }]);
  }

  if (response.error) {
    console.error('Error:', response.error); // log full error message
    alert('Error saving question: ' + response.error.message);
  } else {
    alert('Question saved!');
    this.$router.push('/admin');
  }
},
  
      async deleteQuestion() {
        if (!this.question.id) return
        if (!confirm('Are you sure you want to delete this question?')) return
  
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', this.question.id)
  
        if (error) {
          alert('Failed to delete question')
          console.error(error)
        } else {
          alert('Question deleted!')
          this.$router.push('/admin')
        }
      }
    }
  }
  </script>  
  
  <style scoped>
  button {
    margin-top: 15px;
  }
  </style>
  