const reviewModel = require("../models/review-model")
const inventoryModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

/* ****************************************
*  Deliver add review view
* *************************************** */
async function buildAddReview(req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  
  try {
    const vehicle = await inventoryModel.getVehicleById(inv_id)
    if (!vehicle) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/")
    }

    // Check if user has already reviewed this vehicle
    const hasReviewed = await reviewModel.hasUserReviewed(inv_id, res.locals.accountData.account_id)
    if (hasReviewed) {
      req.flash("notice", "You have already reviewed this vehicle.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    res.render("reviews/add-review", {
      title: `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      errors: null,
    })
  } catch (error) {
    console.error("buildAddReview error: " + error)
    req.flash("notice", "Sorry, there was an error loading the review form.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ****************************************
*  Process add review
* *************************************** */
async function addReview(req, res) {
  let nav = await utilities.getNav()
  const { inv_id, review_title, review_text, review_rating } = req.body
  const account_id = res.locals.accountData.account_id

  try {
    // Check if user has already reviewed this vehicle
    const hasReviewed = await reviewModel.hasUserReviewed(inv_id, account_id)
    if (hasReviewed) {
      req.flash("notice", "You have already reviewed this vehicle.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    const result = await reviewModel.addReview(inv_id, account_id, review_title, review_text, review_rating)
    
    if (result) {
      req.flash("notice", "Your review has been added successfully!")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Sorry, there was an error adding your review.")
      const vehicle = await inventoryModel.getVehicleById(inv_id)
      res.status(501).render("reviews/add-review", {
        title: `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        vehicle,
        errors: null,
        review_title,
        review_text,
        review_rating,
      })
    }
  } catch (error) {
    console.error("addReview error: " + error)
    req.flash("notice", "Sorry, there was an error processing your review.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ****************************************
*  Deliver user's reviews view
* *************************************** */
async function buildMyReviews(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  
  try {
    const reviews = await reviewModel.getReviewsByAccountId(account_id)
    res.render("reviews/my-reviews", {
      title: "My Reviews",
      nav,
      reviews,
      errors: null,
    })
  } catch (error) {
    console.error("buildMyReviews error: " + error)
    req.flash("notice", "Sorry, there was an error loading your reviews.")
    res.redirect("/account/")
  }
}

/* ****************************************
*  Deliver edit review view
* *************************************** */
async function buildEditReview(req, res, next) {
  let nav = await utilities.getNav()
  const review_id = parseInt(req.params.review_id)
  
  try {
    const review = await reviewModel.getReviewById(review_id)
    if (!review || review.account_id !== res.locals.accountData.account_id) {
      req.flash("notice", "Review not found or access denied.")
      return res.redirect("/reviews/my-reviews")
    }

    res.render("reviews/edit-review", {
      title: `Edit Review for ${review.inv_make} ${review.inv_model}`,
      nav,
      review,
      errors: null,
    })
  } catch (error) {
    console.error("buildEditReview error: " + error)
    req.flash("notice", "Sorry, there was an error loading the review.")
    res.redirect("/reviews/my-reviews")
  }
}

/* ****************************************
*  Process edit review
* *************************************** */
async function editReview(req, res) {
  let nav = await utilities.getNav()
  const { review_id, review_title, review_text, review_rating } = req.body
  
  try {
    const existingReview = await reviewModel.getReviewById(review_id)
    if (!existingReview || existingReview.account_id !== res.locals.accountData.account_id) {
      req.flash("notice", "Review not found or access denied.")
      return res.redirect("/review/my-reviews")
    }

    const result = await reviewModel.updateReview(review_id, review_title, review_text, review_rating)
    
    if (result) {
      req.flash("notice", "Your review has been updated successfully!")
      res.redirect("/review/my-reviews")
    } else {
      req.flash("notice", "Sorry, there was an error updating your review.")
      const vehicle = await inventoryModel.getVehicleById(existingReview.inv_id)
      res.status(501).render("reviews/edit-review", {
        title: `Edit Review for ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        review: existingReview,
        vehicle,
        errors: null,
        review_title,
        review_text,
        review_rating,
      })
    }
  } catch (error) {
    console.error("editReview error: " + error)
    req.flash("notice", "Sorry, there was an error processing your review update.")
    res.redirect("/review/my-reviews")
  }
}

/* ****************************************
*  Process delete review
* *************************************** */
async function deleteReview(req, res) {
  const { review_id } = req.body
  
  try {
    const review = await reviewModel.getReviewById(review_id)
    if (!review || review.account_id !== res.locals.accountData.account_id) {
      req.flash("notice", "Review not found or access denied.")
      return res.redirect("/review/my-reviews")
    }

    const result = await reviewModel.deleteReview(review_id)
    
    if (result) {
      req.flash("notice", "Your review has been deleted successfully!")
    } else {
      req.flash("notice", "Sorry, there was an error deleting your review.")
    }
    res.redirect("/review/my-reviews")
  } catch (error) {
    console.error("deleteReview error: " + error)
    req.flash("notice", "Sorry, there was an error deleting your review.")
    res.redirect("/review/my-reviews")
  }
}

/* ****************************************
*  Admin: Deliver reviews management view
* *************************************** */
async function buildAdminReviews(req, res, next) {
  let nav = await utilities.getNav()
  
  try {
    const allReviews = await reviewModel.getAllReviewsForAdmin()
    const pendingReviews = allReviews.filter(review => !review.review_approved)
    const approvedReviews = allReviews.filter(review => review.review_approved)
    
    res.render("reviews/admin-reviews", {
      title: "Manage Reviews",
      nav,
      allReviews,
      pendingReviews,
      approvedReviews,
      errors: null,
    })
  } catch (error) {
    console.error("buildAdminReviews error: " + error)
    req.flash("notice", "Sorry, there was an error loading the reviews.")
    res.redirect("/account/")
  }
}

/* ****************************************
*  Admin: Approve review
* *************************************** */
async function approveReview(req, res) {
  const { review_id } = req.body
  
  try {
    const result = await reviewModel.toggleReviewApproval(review_id, true)
    
    if (result) {
      req.flash("notice", "Review approved successfully!")
    } else {
      req.flash("notice", "Sorry, there was an error approving the review.")
    }
    res.redirect("/review/admin")
  } catch (error) {
    console.error("approveReview error: " + error)
    req.flash("notice", "Sorry, there was an error approving the review.")
    res.redirect("/review/admin")
  }
}

/* ****************************************
*  Admin: Reject review
* *************************************** */
async function rejectReview(req, res) {
  const { review_id } = req.body
  
  try {
    const result = await reviewModel.deleteReview(review_id)
    
    if (result) {
      req.flash("notice", "Review rejected and deleted successfully!")
    } else {
      req.flash("notice", "Sorry, there was an error rejecting the review.")
    }
    res.redirect("/review/admin")
  } catch (error) {
    console.error("rejectReview error: " + error)
    req.flash("notice", "Sorry, there was an error rejecting the review.")
    res.redirect("/review/admin")
  }
}

module.exports = { 
  buildAddReview, 
  addReview, 
  buildMyReviews,
  buildEditReview,
  editReview,
  deleteReview,
  buildAdminReviews,
  approveReview,
  rejectReview
}