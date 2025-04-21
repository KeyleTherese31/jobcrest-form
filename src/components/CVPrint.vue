<template>
    <vue-html2pdf
      ref="pdf"
      :show-layout="false"
      :enable-download="false"
      :float-layout="true"
      :preview-modal="false"
      filename="Jobcrest-CV"
      :pdf-quality="2"
      pdf-format="a4"
    >
      <section slot="pdf-content">
        <div class="printable-cv">
          <h2 class="text-center">Curriculum Vitae</h2>
  
          <h3>I. Personal Identity</h3>
          <table class="cv-table">
            <tr>
              <td><strong>Position Applied:</strong> {{ form.position }}</td>
              <td><strong>Date Applied:</strong> {{ form.date_applied }}</td>
            </tr>
            <tr>
              <td><strong>Last Name:</strong> {{ form.last_name }}</td>
              <td><strong>First Name:</strong> {{ form.first_name }}</td>
            </tr>
            <tr>
              <td><strong>Middle Name:</strong> {{ form.middle_name }}</td>
              <td><strong>Address:</strong> {{ form.address }}</td>
            </tr>
            <tr>
              <td><strong>Contact No.:</strong> {{ form.contact_no }}</td>
              <td><strong>Date of Birth:</strong> {{ form.dob }}</td>
            </tr>
            <tr>
              <td><strong>Place of Birth:</strong> {{ form.pob }}</td>
              <td><strong>Email:</strong> {{ form.email }}</td>
            </tr>
            <tr>
              <td><strong>National ID:</strong> {{ form.national_id }}</td>
              <td><strong>SSS No.:</strong> {{ form.sss_no }}</td>
            </tr>
            <tr>
              <td><strong>TIN No.:</strong> {{ form.tin_no }} <span v-if="form.tin_new">(NEW)</span></td>
              <td><strong>Pag-Ibig No.:</strong> {{ form.pagibig }}</td>
            </tr>
            <tr>
              <td><strong>Philhealth No.:</strong> {{ form.philhealth }}</td>
              <td><strong>Civil Status:</strong> {{ form.civil_status }}</td>
            </tr>
          </table>
  
          <h3>II. Educational Background</h3>
          <table class="cv-table">
            <tr><th>Level</th><th>Course/Degree</th><th>School</th><th>Year</th></tr>
            <tr v-for="level in educationLevels" :key="level.key">
              <td>{{ level.label }}</td>
              <td>{{ form.education[level.key]?.course }}</td>
              <td>{{ form.education[level.key]?.school }}</td>
              <td>{{ form.education[level.key]?.year }}</td>
            </tr>
          </table>
  
          <h3>III. Scholarships / Licenses</h3>
          <table class="cv-table">
            <tr><th>Title</th><th>Institution</th></tr>
            <tr v-for="(item, i) in form.scholarships" :key="i">
              <td>{{ item.title }}</td>
              <td>{{ item.institution }}</td>
            </tr>
          </table>
  
          <h3>IV. Family Background</h3>
          <table class="cv-table">
            <tr><th>Relation</th><th>Last Name</th><th>First Name</th><th>Age</th><th>Occupation</th></tr>
            <tr v-for="(person, key) in familyMembers" :key="key">
              <td>{{ person.label }}</td>
              <td>{{ form.family[key].last_name }}</td>
              <td>{{ form.family[key].first_name }}</td>
              <td>{{ form.family[key].age }}</td>
              <td>{{ form.family[key].occupation }}</td>
            </tr>
          </table>
  
          <h3>V. Employment History</h3>
          <table class="cv-table">
            <tr><th>Employer</th><th>Address</th><th>Position</th><th>Tenure</th></tr>
            <tr v-for="(job, i) in form.employment" :key="i">
              <td>{{ job.employer }}</td>
              <td>{{ job.address }}</td>
              <td>{{ job.position }}</td>
              <td>{{ job.tenure }}</td>
            </tr>
          </table>
  
          <h3>VI. References</h3>
          <table class="cv-table">
            <tr><th>Name</th><th>Occupation</th><th>Contact</th><th>Years Known</th></tr>
            <tr v-for="(ref, i) in form.references" :key="i">
              <td>{{ ref.name }}</td>
              <td>{{ ref.occupation }}</td>
              <td>{{ ref.contact }}</td>
              <td>{{ ref.years_known }}</td>
            </tr>
          </table>
  
          <h3>VII. Declaration</h3>
          <p class="mt-2">
            I hereby acknowledge that the above information is true and correct to the best of my knowledge and ability, and any false statements made by me on this application or any supplementary records attached thereto shall be sufficient grounds for disqualification from the company.
          </p>
  
          <div class="signature-block mt-5">
            <div class="signature-line">________________________________________</div>
            <p>Applicant's Signature</p>
          </div>
        </div>
      </section>
    </vue-html2pdf>
  </template>
  
  <script>
  import VueHtml2pdf from 'vue-html2pdf'
  
  export default {
    name: 'CVPrint',
    props: {
      form: Object,
      educationLevels: Array,
      familyMembers: Object
    },
    components: {
      VueHtml2pdf
    },
    methods: {
      downloadPDF() {
        this.$refs.pdf.downloadPdf()
      }
    }
  }
  </script>
  
  <style scoped>
  .printable-cv {
    font-family: Arial, sans-serif;
    font-size: 12px;
    color: #000;
    padding: 20px;
    line-height: 1.5;
  }
  
  h2, h3 {
    margin: 10px 0;
    text-align: left;
  }
  
  .cv-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }
  
  .cv-table td, .cv-table th {
    border: 1px solid #aaa;
    padding: 6px;
    text-align: left;
    vertical-align: top;
  }
  
  .cv-table th {
    background-color: #f0f0f0;
  }
  
  .signature-block {
    margin-top: 40px;
    text-align: center;
  }
  
  .signature-line {
    border-top: 1px solid #000;
    width: 80%;
    margin: 0 auto;
    margin-bottom: 6px;
  }
  </style>
  