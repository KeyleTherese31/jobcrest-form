<template>
    <div class="container mt-5">
      <h3 class="mb-4 text-center">Test: {{ testName }}</h3>
  
      <div v-if="questions.length === 0" class="text-center">
        <p>No questions found for this test.</p>
      </div>
  
      <div v-else>
        <div v-for="(q, i) in questions" :key="q.id" class="mb-4">
          <strong>Question {{ i + 1 }}:</strong>
          <p>{{ q.label }}</p>
  
          <div v-if="q.image_url">
            <img :src="q.image_url" alt="Question Image" style="max-width: 300px;" />
          </div>
  
          <ul v-if="q.choices">
            <li v-for="(choice, cIdx) in q.choices.split(',')" :key="cIdx">
            <label>
                <input
                type="radio"
                :name="'question-' + q.id"
                :value="choice.trim()"
                v-model="answers[q.id]"
                />
                {{ choice.trim() }}
            </label>
            </li>
          </ul>
        </div>
      </div>
      <button class="btn btn-success mt-4" @click="submitAnswers">Submit Answers</button>
    </div>
  </template>
  
  <script>
  import { createClient } from '@supabase/supabase-js'
  
  const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
  const supabaseKey = process.env.VUE_APP_SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  export default {
    data() {
    return {
        testName: '',
        questions: [],
        answers: {}, 
        profileId: null 
    }
    },
    methods: {
        async submitAnswers() {
            if (!this.profileId) {
                alert('No profile ID found. Cannot submit answers.');
                return;
            }

            const answersArray = Object.entries(this.answers).map(([question_id, answer]) => ({
                profile_id: this.profileId,
                question_id,
                answer
            }));

            const { error } = await supabase.from('answers').insert(answersArray);

            if (error) {
                console.error('Failed to submit answers:', error);
            } else {
                alert('Answers submitted successfully!');
            }
        }
    },
    async mounted() {
    const testType = this.$route.params.testType
    this.profileId = localStorage.getItem('profileId');
    this.testName = testType

    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('test_type', testType)

    if (error) {
        console.error('Failed to load questions:', error)
    } else {
        this.questions = data
    }
    }
  }
  </script>
  