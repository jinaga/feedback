async function createContent() {
    const user = await j.fact({
        type: 'Jinaga.User',
        publicKey: 'An RSA public key goes here'
    });
    const site = await j.fact({
        type: 'Feedback.Site',
        uniqueId: '425b853b-8208-46b1-868a-275b35eaba7d',
        createdBy: user
    });
    const domain = await j.fact({
        type: 'Feedback.Site.Domain',
        site,
        value: 'historicalmodeling.com',
        prior: []
    });
    const content = await j.fact({
        type: 'Feedback.Content',
        site,
        path: '/factual/'
    });

    return content;
}

async function createComment(content: {}) {
    const commenter = await j.fact({
        type: 'Jinaga.User',
        publicKey: 'A different RSA public key goes here'
    });
    const comment = await j.fact({
        type: 'Feedback.Comment',
        uniqueId: '16f359cc-4125-4259-ab22-481a95dcc7f7',
        content,
        author: commenter
    });
    const text = await j.fact({
        type: 'Feedback.Comment.Text',
        comment,
        value: 'I\d like to learn more about this.',
        prior: []
    });

    return comment;
}

function commentIsDeleted(comment: {}) {
    return j.exists({
        type: 'Feedback.Comment.Delete',
        comment
    });
}

function commentForContent(content: {}) {
    return j.match({
        type: 'Feedback.Comment',
        content
    }).suchThat(j.not(commentIsDeleted));
}

function commentTextIsCurrent(commentText: {}) {
    return j.notExists({
        type: 'Feedback.Comment.Text',
        prior: [commentText]
    });
}

function textForComment(comment: {}) {
    return j.match({
        type: 'Feedback.Comment.Text',
        comment
    }).suchThat(commentTextIsCurrent);
}

async function listComments(path: string) {
    // This part will be injected onto the page.
    const site = {
        type: 'Feedback.Site',
        uniqueId: '425b853b-8208-46b1-868a-275b35eaba7d',
        createdBy: {
            type: 'Jinaga.User',
            publicKey: 'An RSA public key goes here'
        }
    };
    // This part will be generated client-side.
    const content = {
        type: 'Feedback.Content',
        site,
        path
    };

    const commentTexts = await j.query(content, j.for(commentForContent).then(textForComment));
    return commentTexts;
}

listComments('/factual/')
    .then(comments => console.log(JSON.stringify(comments, null, 2)));