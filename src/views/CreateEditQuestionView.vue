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
  export default {
    data() {
      return {
        isEditing: false,
        question: {
          label: '',
          type: 'text',
          image: '',
          testType: 'pattern' // default to a test type
        },
        questionIndex: null, // Will store index of the question being edited
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
    mounted() {
      const questionIndex = this.$route.params.index
      if (questionIndex !== undefined) {
        this.isEditing = true
        this.questionIndex = questionIndex
        const savedQuestions = JSON.parse(localStorage.getItem('questions') || '{}')
        for (let testType in savedQuestions) {
          const testQuestions = savedQuestions[testType]
          const question = testQuestions.find(q => q.id === questionIndex)
          if (question) {
            this.question = { ...question }
          }
        }
      }
    },
    methods: {
      onImageUpload(e) {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = e => {
            this.question.image = e.target.result
          }
          reader.readAsDataURL(file)
        }
      },
      saveQuestion() {
        const savedQuestions = JSON.parse(localStorage.getItem('questions') || '{}')
  
        if (!savedQuestions[this.question.testType]) {
          savedQuestions[this.question.testType] = []
        }
  
        if (this.isEditing) {
          const updatedQuestions = savedQuestions[this.question.testType].map(q => q.id === this.question.id ? { ...this.question } : q)
          savedQuestions[this.question.testType] = updatedQuestions
        } else {
          savedQuestions[this.question.testType].push({ ...this.question, id: Date.now() })
        }
  
        localStorage.setItem('questions', JSON.stringify(savedQuestions))
        this.$router.push('/admin') // Redirect back to Admin Panel
      },
      deleteQuestion() {
        if (confirm('Are you sure you want to delete this question?')) {
          const savedQuestions = JSON.parse(localStorage.getItem('questions') || '{}')
          savedQuestions[this.question.testType] = savedQuestions[this.question.testType].filter(q => q.id !== this.question.id)
          localStorage.setItem('questions', JSON.stringify(savedQuestions))
          this.$router.push('/admin') // Redirect back to Admin Panel
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
  