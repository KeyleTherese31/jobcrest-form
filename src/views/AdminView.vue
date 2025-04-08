<template>
    <div class="container mt-4">
      <h2 class="mb-4">Admin Panel — Create Questions</h2>
  
      <div class="form-group">
        <label>Question Type</label>
        <select v-model="newQuestion.type" class="form-control">
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </div>
  
      <div class="form-group">
        <label>Question Label</label>
        <input v-model="newQuestion.label" class="form-control" placeholder="Enter question" />
      </div>
  
      <div v-if="newQuestion.type === 'image'" class="form-group">
        <label>Image</label>
        <input type="file" @change="onImageUpload" class="form-control-file" />
        <div v-if="newQuestion.image" class="mt-2">
          <img :src="newQuestion.image" class="img-thumbnail" style="max-width: 200px;" />
        </div>
      </div>
  
      <button @click="addQuestion" class="btn btn-primary mt-3">Add Question</button>
  
      <hr />
  
      <h4>Question List</h4>
      <div v-if="questions.length === 0">No questions added yet.</div>
      <ul class="list-group">
        <li v-for="(q, i) in questions" :key="i" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ q.label }}</strong>
            <span class="badge badge-info ml-2">{{ q.type }}</span>
            <div v-if="q.image">
              <img :src="q.image" style="max-width: 100px;" class="mt-2" />
            </div>
          </div>
          <div>
            <button @click="archiveQuestion(i)" class="btn btn-sm btn-warning mr-2">Archive</button>
            <button @click="deleteQuestion(i)" class="btn btn-sm btn-danger">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newQuestion: {
          label: '',
          type: 'text',
          image: ''
        },
        questions: []
      }
    },
    mounted() {
      const saved = localStorage.getItem('questions')
      if (saved) {
        this.questions = JSON.parse(saved)
      }
    },
    methods: {
      onImageUpload(e) {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = e => {
            this.newQuestion.image = e.target.result
          }
          reader.readAsDataURL(file)
        }
      },
      addQuestion() {
        if (!this.newQuestion.label) return alert('Please enter a question label.')
        this.questions.push({ ...this.newQuestion })
        this.save()
        this.reset()
      },
      deleteQuestion(index) {
        if (confirm('Delete this question?')) {
          this.questions.splice(index, 1)
          this.save()
        }
      },
      archiveQuestion(index) {
        const archived = JSON.parse(localStorage.getItem('archived_questions') || '[]')
        archived.push(this.questions[index])
        localStorage.setItem('archived_questions', JSON.stringify(archived))
  
        this.questions.splice(index, 1)
        this.save()
      },
      save() {
        localStorage.setItem('questions', JSON.stringify(this.questions))
      },
      reset() {
        this.newQuestion = { label: '', type: 'text', image: '' }
      }
    }
  }
  </script>
  