const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    // Review title is required and must be string
    body("review_title")
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage("Review title must be between 5 and 100 characters."),

    // Review text is required
    body("review_text")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),

    // Rating is required and must be between 1-5
    body("review_rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5 stars."),

    // Inventory ID is required
    body("inv_id")
      .isInt({ min: 1 })
      .withMessage("Valid vehicle ID is required."),
  ]
}

/* ******************************
 * Check data and return errors or continue to review addition
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id, review_title, review_text, review_rating } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const inventoryModel = require("../models/inventoryModel")
    const vehicle = await inventoryModel.getVehicleById(inv_id)
    res.render("reviews/add-review", {
      errors,
      title: vehicle ? `Review ${vehicle.inv_make} ${vehicle.inv_model}` : "Add Review",
      nav,
      vehicle,
      review_title,
      review_text,
      review_rating,
    })
    return
  }
  next()
}

module.exports = validate

<!-- filepath: /home/kasule/Documents/Spring Semester 2025/CSE 340 Web Backend Development/CSE-340-starter/views/reviews/add-review.ejs -->
<% layout('layouts/layout') -%>

<% if (title) { %>
  <h1><%= title %></h1>
<% } else { 
  res.redirect('/')
} %>

<% if (messages && messages.notice) { %>
  <p class="notice"><%= messages.notice %></p>
<% } %>

<% if (errors) { %>
  <ul class="notice">
    <% errors.array().forEach(error => { %>
      <li><%= error.msg %></li>
    <% }) %>
  </ul>
<% } %>

<div class="review-form-container">
  <h2>Share Your Experience</h2>
  
  <div class="vehicle-info">
    <h3><%= vehicle.inv_make %> <%= vehicle.inv_model %></h3>
    <p><%= vehicle.inv_year %> • <%= vehicle.inv_color %></p>
  </div>

  <form action="/review/add" method="post" class="review-form">
    <input type="hidden" name="inv_id" value="<%= vehicle.inv_id %>">
    
    <label for="review_title">Review Title:</label>
    <input type="text" id="review_title" name="review_title" maxlength="100" required
           value="<%= locals.review_title ? review_title : '' %>"
           placeholder="Brief summary of your experience">
    
    <label for="review_rating">Rating:</label>
    <select id="review_rating" name="review_rating" required>
      <option value="">Select a rating</option>
      <option value="5" <%= locals.review_rating == 5 ? 'selected' : '' %>>⭐⭐⭐⭐⭐ Excellent</option>
      <option value="4" <%= locals.review_rating == 4 ? 'selected' : '' %>>⭐⭐⭐⭐ Very Good</option>
      <option value="3" <%= locals.review_rating == 3 ? 'selected' : '' %>>⭐⭐⭐ Good</option>
      <option value="2" <%= locals.review_rating == 2 ? 'selected' : '' %>>⭐⭐ Fair</option>
      <option value="1" <%= locals.review_rating == 1 ? 'selected' : '' %>>⭐ Poor</option>
    </select>
    
    <label for="review_text">Your Review:</label>
    <textarea id="review_text" name="review_text" rows="6" maxlength="1000" required
              placeholder="Tell others about your experience with this vehicle..."><%= locals.review_text ? review_text : '' %></textarea>
    <div class="char-count">
      <span id="charCount">0</span>/1000 characters
    </div>
    
    <div class="form-buttons">
      <button type="submit" class="btn btn-primary">Submit Review</button>
      <a href="/inv/detail/<%= vehicle.inv_id %>" class="btn btn-secondary">Cancel</a>
    </div>
  </form>
</div>

<script>
  // Character counter for review text
  const textarea = document.getElementById('review_text');
  const charCount = document.getElementById('charCount');
  
  function updateCharCount() {
    charCount.textContent = textarea.value.length;
  }
  
  textarea.addEventListener('input', updateCharCount);
  updateCharCount(); // Initialize count
</script>

<style>
.review-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.vehicle-info {
  background: #fff;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #4a90e2;
}

.vehicle-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.vehicle-info p {
  margin: 0;
  color: #666;
}

.review-form {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
}

.review-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.review-form input,
.review-form select,
.review-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.review-form textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  text-align: right;
  margin-top: -10px;
  margin-bottom: 15px;
  color: #666;
  font-size: 0.9em;
}

.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background: #357abd;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}
</style>