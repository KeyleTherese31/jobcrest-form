<template>
  <div class="container mt-4 panel-wrapper">
    <!-- Back Button -->
    <button class="btn btn-back mb-3" @click="$router.back()">
      ← Back
    </button>

    <h2 class="mb-4 text-center text-primary">
      {{ isEditing ? 'Edit Question' : 'Create New Question' }}
    </h2>

    <form @submit.prevent="isEditing ? saveQuestion() : addToList()">
      <div class="form-group">
        <label>Test Type</label>
        <select v-model="question.testType" class="form-control category-select" required>
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
          <option value="checkOrX">Check or X</option>
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
          <img :src="question.image" class="img-thumbnail question-image" />
        </div>
      </div>

      <div class="d-flex justify-content-between mt-3">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Save Changes' : 'Add Another Question' }}
        </button>

        <button
          v-if="questionList.length && !isEditing"
          type="button"
          @click="submitAllQuestions"
          class="btn btn-success"
        >
          Submit All ({{ questionList.length }})
        </button>
      </div>
    </form>

    <!-- Question list preview -->
    <div v-if="questionList.length && !isEditing" class="mt-4">
      <h5 class="text-blue">Questions to be Submitted:</h5>
      <ul class="list-group">
        <li v-for="(q, i) in questionList" :key="i" class="list-group-item">
          <strong>{{ q.label }}</strong>
          <span class="badge badge-info ml-2">{{ q.type }}</span>
        </li>
      </ul>
    </div>

    <!-- Delete (only for edit mode) -->
    <div v-if="isEditing" class="mt-4 text-right">
      <button @click="deleteQuestion" class="btn btn-danger">Delete Question</button>
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
      questionList: [],
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
      const { id, label, type, format, choices, image, testType } = this.question

      let response
      if (this.isEditing && id) {
        response = await supabase
          .from('questions')
          .update({ label, type, format, choices, image_url: image || null, test_type: testType })
          .eq('id', id)
      }

      if (response.error) {
        alert('Error saving question: ' + response.error.message)
        console.error('Error:', response.error)
      } else {
        alert('Question saved!')
        this.$router.push('/admin')
      }
    },

    addToList() {
      const { label, type, format, image, choices, testType } = this.question

      if (!label || !type || (type === 'text' && !format)) {
        alert('Please complete the question fields')
        return
      }

      this.questionList.push({
        label,
        type,
        format,
        image_url: image || null,
        choices,
        test_type: testType
      })

      // Reset form for next input
      this.question.label = ''
      this.question.type = 'text'
      this.question.format = 'multipleChoice'
      this.question.image = ''
      this.question.choices = ''
    },

    async submitAllQuestions() {
      if (!this.questionList.length) return

      const { error } = await supabase
        .from('questions')
        .insert(this.questionList)

      if (error) {
        alert('Failed to submit questions')
        console.error(error)
      } else {
        alert('All questions saved!')
        this.questionList = []
        this.$router.push('/admin')
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
  },
}
</script>

<style scoped>
.panel-wrapper {
  background-color: #f9fcff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 73, 128, 0.1);
}

.text-blue {
  color: #0056b3;
}

.btn-back {
  background-color: #ffcc00;
  color: #003366;
  font-weight: bold;
  border: none;
  border-radius: 8px;
}

.btn-back:hover {
  background-color: #ffdb4d;
}

.category-select {
  border: 2px solid #007bff;
  border-radius: 6px;
}

.question-image {
  max-width: 200px;
  border: 2px solid #007bff;
  border-radius: 8px;
}
</style>

