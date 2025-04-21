<template>
  <div class="container mt-4 panel-wrapper">
    <!-- Back Button -->
    <button class="btn btn-back mb-3" @click="$router.back()">
      <img src="@/assets/back-button.png" alt="back"> Back
    </button>

    <h2 class="mb-4 text-center text-primary">
      {{ isEditing ? 'Edit Question' : 'Create New Question' }}
    </h2>

    <form @submit.prevent="isEditing ? saveQuestion() : addToList()">
      <!-- Test Type -->
      <div class="form-group">
        <label>Test Type</label>
        <select v-model="question.testType" class="form-control category-select" required>
          <option v-for="test in tests" :key="test.id" :value="test.id">{{ test.name }}</option>
        </select>
      </div>

      <!-- Type: text or image -->
      <div class="form-group">
        <label>Question Type</label>
        <select v-model="question.type" class="form-control" required>
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </div>

      <!-- Question Label -->
      <div class="form-group">
        <label>Question Label</label>
        <input v-model="question.label" class="form-control" placeholder="Enter question" required />
      </div>

      <!-- Format -->
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

      <!-- Choices (for multipleChoice) -->
      <div v-if="question.format === 'multipleChoice'" class="form-group">
        <label>Choices (comma separated)</label>
        <input v-model="question.choices" class="form-control" placeholder="e.g. A, B, C, D" />
        <label class="mt-2">Answer Key</label>
        <input v-model="question.answerKey" class="form-control" placeholder="e.g. B" />
      </div>

      <!-- Answer key for True/False -->
      <div v-if="question.format === 'trueFalse'" class="form-group">
        <label>Correct Answer</label>
        <select v-model="question.answerKey" class="form-control">
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <!-- Answer key for short/long -->
      <div v-if="['shortAnswer', 'longAnswer'].includes(question.format)" class="form-group">
        <label>Answer Key</label>
        <input v-model="question.answerKey" class="form-control" placeholder="Enter correct answer" />
      </div>

      <!-- Paragraph + check sentences -->
      <div v-if="question.format === 'checkOrX' && question.testType === 'read'" class="form-group">
        <label>Paragraph / Situation</label>
        <textarea v-model="question.paragraph" class="form-control" placeholder="Enter the paragraph" required></textarea>

        <label class="mt-3">Sentences (Mark as Check or X)</label>
        <div v-for="(item, index) in question.checkSentences" :key="index" class="d-flex align-items-center mb-2">
          <input v-model="item.text" class="form-control mr-2" placeholder="Enter sentence" required />
          <select v-model="item.correct" class="form-control w-25">
            <option :value="true">✔️ Check (Tama)</option>
            <option :value="false">❌ X (Mali)</option>
          </select>
        </div>
        <button type="button" class="btn btn-outline-secondary btn-sm mt-2" @click="addCheckSentence">
          ➕ Add Sentence
        </button>
      </div>

      <!-- Image upload -->
      <div v-if="question.type === 'image'" class="form-group">
        <label>Image</label>
        <input type="file" @change="onImageUpload" class="form-control-file" />
        <div v-if="question.image" class="mt-2">
          <img :src="question.image" class="img-thumbnail question-image" />
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="d-flex justify-content-between mt-3">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Save Changes' : 'Add Another Question' }}
        </button>
        <button v-if="questionList.length && !isEditing" type="button" @click="submitAllQuestions" class="btn btn-success">
          Submit All ({{ questionList.length }})
        </button>
      </div>
    </form>

    <!-- List Preview -->
    <div v-if="questionList.length && !isEditing" class="mt-4">
      <h5 class="text-blue">Questions to be Submitted:</h5>
      <ul class="list-group">
        <li v-for="(q, i) in questionList" :key="i" class="list-group-item">
          <strong>{{ q.label }}</strong>
          <span class="badge badge-info ml-2">{{ q.type }}</span>
        </li>
      </ul>
    </div>

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
        testType: 'pattern',
        paragraph: '',
        answerKey: '',
        checkSentences: []
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
      const { data, error } = await supabase.from('questions').select('*').eq('test_type', testType)

      if (!error && data && data[index]) {
        const q = data[index]
        this.isEditing = true
        this.question = {
          id: q.id,
          label: q.label,
          type: q.type,
          format: q.format,
          image: q.image_url,
          choices: q.choices,
          testType: q.test_type,
          paragraph: q.paragraph || '',
          answerKey: q.answer_key || '',
          checkSentences: q.check_sentences || []
        }
      }
    }
  },
  methods: {
    addCheckSentence() {
      this.question.checkSentences.push({ text: '', correct: true })
    },

    async onImageUpload(e) {
      const file = e.target.files[0]
      if (!file) return
      const fileName = `question-images/${uuidv4()}`
      const { error } = await supabase.storage.from('images').upload(fileName, file)
      if (error) return alert('Image upload failed.')
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      this.question.image = data.publicURL
    },

    async saveQuestion() {
      const { id, label, type, format, choices, image, testType, paragraph, checkSentences, answerKey } = this.question

      const payload = {
        label, type, format, choices, test_type: testType,
        image_url: image || null,
        paragraph: paragraph || '',
        check_sentences: checkSentences || [],
        answer_key: answerKey || ''
      }

      const { error } = await supabase.from('questions').update(payload).eq('id', id)
      if (error) {
        alert('Error saving question: ' + error.message)
      } else {
        alert('Question saved!')
        this.$router.push('/admin')
      }
    },

    addToList() {
      const q = { ...this.question }
      if (!q.label || !q.type || (q.type === 'text' && !q.format)) {
        alert('Please fill in all required fields')
        return
      }

      this.questionList.push({
        label: q.label,
        type: q.type,
        format: q.format,
        image_url: q.image || null,
        choices: q.choices,
        test_type: q.testType,
        paragraph: q.paragraph || '',
        check_sentences: q.checkSentences || [],
        answer_key: q.answerKey || ''
      })

      // Reset form
      this.question = {
        id: null,
        label: '',
        type: 'text',
        format: 'multipleChoice',
        image: '',
        choices: '',
        testType: 'pattern',
        paragraph: '',
        answerKey: '',
        checkSentences: []
      }
    },

    async submitAllQuestions() {
      const { error } = await supabase.from('questions').insert(this.questionList)
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
      const { error } = await supabase.from('questions').delete().eq('id', this.question.id)
      if (error) {
        alert('Failed to delete')
        console.error(error)
      } else {
        alert('Deleted!')
        this.$router.push('/admin')
      }
    }
  }
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
