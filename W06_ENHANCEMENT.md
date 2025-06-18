# W06 Final Enhancement: Vehicle Reviews & Ratings System

## Enhancement Overview

This enhancement adds a comprehensive Vehicle Reviews & Ratings System to the CSE 340 Motor Co. website. Users can now read and write reviews for vehicles, while administrators can moderate submissions to ensure quality content.

## Features Implemented

### 1. User Features
- **Add Reviews**: Authenticated users can write reviews for any vehicle
- **Rate Vehicles**: 5-star rating system with visual star display
- **View Reviews**: All users can view approved reviews on vehicle detail pages
- **My Reviews**: Users can view, edit, and delete their own reviews
- **Prevent Duplicates**: Users can only review each vehicle once

### 2. Administrative Features
- **Review Moderation**: Admins and employees can approve/reject reviews
- **Admin Dashboard**: Organized view of pending, approved, and all reviews
- **Content Control**: Reviews require approval before being publicly visible

### 3. Database Integration
- **New Tables**: Reviews table with proper foreign key relationships
- **Data Validation**: Server-side validation for all review data
- **Prepared Statements**: All database queries use prepared statements for security

### 4. Technical Implementation
- **MVC Architecture**: Follows established pattern with dedicated model, views, and controller
- **Error Handling**: Comprehensive error handling throughout the system
- **Responsive Design**: Mobile-friendly interface with CSS Grid and Flexbox
- **Form Validation**: Both client-side and server-side validation

## Files Added/Modified

### New Files Created:
- `/models/review-model.js` - Database operations for reviews
- `/controllers/review-controller.js` - Business logic for review operations
- `/routes/review.js` - Route definitions for review endpoints
- `/utilities/review-validation.js` - Validation rules for review forms
- `/views/reviews/add-review.ejs` - Add new review form
- `/views/reviews/my-reviews.ejs` - User's review management page
- `/views/reviews/edit-review.ejs` - Edit existing review form
- `/views/reviews/admin-reviews.ejs` - Admin review moderation interface
- `/database/reviews.sql` - Database schema and sample data

### Modified Files:
- `/server.js` - Added review routes
- `/views/inventory/detail.ejs` - Integrated reviews display
- `/views/account/management.ejs` - Added review-related navigation
- `/controllers/inventoryController.js` - Added review data to vehicle details

## Database Schema

```sql
CREATE TABLE public.review (
  review_id SERIAL PRIMARY KEY,
  inv_id INTEGER NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
  account_id INTEGER NOT NULL REFERENCES public.account(account_id) ON DELETE CASCADE,
  review_title VARCHAR(100) NOT NULL,
  review_text TEXT NOT NULL,
  review_rating INTEGER NOT NULL CHECK (review_rating >= 1 AND review_rating <= 5),
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  review_approved BOOLEAN DEFAULT FALSE,
  UNIQUE(inv_id, account_id)
);
```

## Routes Available

### User Routes (Login Required):
- `GET /review/add/:inv_id` - Add review form for specific vehicle
- `POST /review/add` - Process new review submission
- `GET /review/my-reviews` - View user's reviews
- `GET /review/edit/:review_id` - Edit review form
- `POST /review/edit` - Process review update
- `POST /review/delete` - Delete user's review

### Admin Routes (Admin/Employee Only):
- `GET /review/admin` - Admin review moderation interface
- `POST /review/admin/approve` - Approve a review
- `POST /review/admin/reject` - Reject and delete a review

## Validation Rules

### Review Title:
- Required field
- 5-100 characters
- Text input with character counter

### Review Text:
- Required field
- 10-1000 characters
- Textarea with live character counter

### Rating:
- Required field
- Integer between 1-5
- Visual star selection interface

## Error Handling

- **User Errors**: Friendly error messages with form data retention
- **Database Errors**: Graceful degradation with informative notices
- **Access Control**: Proper authentication and authorization checks
- **Data Validation**: Comprehensive server-side validation

## Navigation for Graders

### To Test User Features:
1. Register/Login as a regular user
2. Navigate to any vehicle detail page
3. Click "Write a Review" button
4. Fill out and submit review form
5. Access "My Reviews" from account management page

### To Test Admin Features:
1. Login with Admin or Employee account
2. Go to Account Management
3. Click "Moderate Reviews" button
4. Review pending submissions
5. Approve or reject reviews as needed

### Sample Test Data:
The `reviews.sql` file includes sample reviews for testing. Run this after creating the table structure.

## Security Features

- **Authentication**: All review operations require login
- **Authorization**: Admin functions restricted to appropriate account types
- **SQL Injection Prevention**: All queries use prepared statements
- **Duplicate Prevention**: Database constraints prevent multiple reviews per user/vehicle
- **Data Validation**: Both client and server-side validation

## Enhancement Requirements Fulfilled

✅ **Database Interaction**: New review table with full CRUD operations
✅ **New Model**: `review-model.js` with comprehensive database methods
✅ **New Controller**: `review-controller.js` with proper error handling
✅ **New Views**: Multiple EJS templates for review operations
✅ **Form Validation**: Client and server-side validation implemented
✅ **Error Handling**: Comprehensive error handling throughout
✅ **Integration**: Seamlessly integrated with existing vehicle system
✅ **Documentation**: This comprehensive documentation file

## Future Enhancements

Potential future improvements could include:
- Review helpfulness voting
- Image uploads for reviews
- Review response system for dealers
- Advanced filtering and sorting options
- Email notifications for review status changes

---

**Note**: This enhancement demonstrates advanced web development concepts including database design, security considerations, user experience design, and administrative functionality while maintaining the existing codebase structure and conventions.