<template>
    <div class="container mt-5">
        <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo" />
        <br><br>
      <h3 class="mb-4 text-center">Available Tests</h3>
  
      <div v-if="tests.length === 0" class="text-center">
        <p>No tests available at the moment.</p>
      </div>
  
      <ul class="list-group" v-else>
        <li
          v-for="(test, i) in tests"
          :key="i"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ test.name }}
          <button class="btn btn-sm btn-success" @click="startTest(test)">
            Start Test
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tests: [
          { name: 'Test 1: Image Pattern Analysis', id: 'pattern' },
          { name: 'Test 2: Basic Math', id: 'math' },
          { name: 'Test 3: Numerical Form', id: 'math2' },
          { name: 'Test 4: Reading Comprehension', id: 'read' },
          { name: 'Pre Interview Questionaire', id: 'pretf' },
          { name: 'Sentence Completion', id: 'sentcomp' },
          
          // In the future, you can pull these from localStorage or backend
        ]
      }
    },
    methods: {
      startTest(test) {
        // Pass test ID as query param or route param (future-ready)
        this.$router.push({ path: '/test', query: { test: test.id } })
      }
    }
  }
  </script>
  