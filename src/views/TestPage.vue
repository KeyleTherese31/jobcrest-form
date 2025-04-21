<template>
  <div class="container mt-5 mb-5">
    <div class="card shadow-lg p-4">
      <h3 class="mb-4 text-center text-primary font-weight-bold">Test: {{ testName }}</h3>

      <div v-if="questions.length === 0" class="text-center text-muted">
        <p>No questions found for this test.</p>
      </div>

      <div v-else>
        <div
          v-for="(q, i) in questions"
          :key="q.id"
          class="mb-5 p-3 border rounded bg-light"
        >
          <h5 class="text-center"><strong>Question {{ i + 1 }}:</strong></h5>
          <p class="mb-2 text-center">{{ q.label }}</p>

          <div v-if="q.image_url" class="mb-3 text-center">
            <img
              :src="q.image_url"
              alt="Question Image"
              class="img-fluid rounded shadow"
              style="max-height: 250px;"
            />
          </div>

          <!-- Multiple Choice -->
          <div v-if="q.format === 'multipleChoice' && q.choices" class="d-flex justify-content-center">
            <div
              v-for="(choice, cIdx) in q.choices.split(',')"
              :key="cIdx"
              class="form-check mb-2 text-center"
            >
              <input
                class="form-check-input me-2"
                type="radio"
                :name="'question-' + q.id"
                :id="'q' + q.id + '-choice' + cIdx"
                :value="choice.trim()"
                v-model="answers[q.id]"
              />
              <label
                class="form-check-label"
                :for="'q' + q.id + '-choice' + cIdx"
                style="margin: 0;"
              >
                {{ choice.trim() }}
              </label>
            </div>
          </div>

          <!-- True/False -->
          <div v-if="q.format === 'trueFalse'" class="d-flex justify-content-center gap-4 align-items-center mb-3">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                :name="'question-' + q.id"
                :id="'q' + q.id + '-true'"
                value="True"
                v-model="answers[q.id]"
              />
              <label class="form-check-label ms-1" :for="'q' + q.id + '-true'">True</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                :name="'question-' + q.id"
                :id="'q' + q.id + '-false'"
                value="False"
                v-model="answers[q.id]"
              />
              <label class="form-check-label ms-1" :for="'q' + q.id + '-false'">False</label>
            </div>
          </div>

          <!-- Short Answer -->
          <div v-if="q.format === 'shortAnswer'" class="form-group">
            <input
              type="text"
              class="form-control"
              v-model="answers[q.id]"
              maxlength="6"
              placeholder="Enter a short answer (max 6 characters)"
            />
          </div>

          <!-- Long Answer -->
          <div v-if="q.format === 'longAnswer'" class="form-group">
            <textarea
              class="form-control"
              rows="3"
              maxlength="60"
              v-model="answers[q.id]"
              placeholder="Enter a longer answer (max 60 characters)"
            ></textarea>
          </div>

          <!-- Check or X -->
          <div v-if="q.format === 'checkOrX'" class="d-flex justify-content-center">
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="radio"
                :name="'question-' + q.id"
                :id="'q' + q.id + '-check'"
                value="Check"
                v-model="answers[q.id]"
              />
              <label class="form-check-label" :for="'q' + q.id + '-check'">Check</label>
            </div>
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="radio"
                :name="'question-' + q.id"
                :id="'q' + q.id + '-x'"
                value="X"
                v-model="answers[q.id]"
              />
              <label class="form-check-label" :for="'q' + q.id + '-x'">X</label>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button class="btn btn-success btn-lg px-4" @click="submitAnswers">
          Submit Answers
        </button>
      </div>
    </div>
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
  