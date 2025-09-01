import React, { useState, useEffect } from 'react'
import {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment,
    replyToComment
} from '../../services/commentService'
import './Comments.scss'

const Comments = ({ postId, currentUser }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [editingComment, setEditingComment] = useState(null)
    const [editContent, setEditContent] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyContent, setReplyContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // comment functions (fetch, add, edit, delete, reply) would go here

}

export default Comments;