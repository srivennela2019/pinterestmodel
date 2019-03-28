function likes(postid, like) {
  this.postid = postid;
  this.like = like;
}
function comment(postId, id, name, email, body) {
  this.postId = postId;
  this.id = id;
  this.name = name;
  this.email = email;
  this.body = body;
}
let postd = new Promise(function(resolve, reject) {
  jQuery.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    success: function(data) {
      resolve(data);
    }
  });
});
let commd = new Promise(function(resolve, reject) {
  jQuery.ajax({
    url: "https://jsonplaceholder.typicode.com/comments",
    success: function(data) {
      resolve(data);
    }
  });
});
let userd = new Promise(function(resolve, reject) {
  jQuery.ajax({
    url: "https://jsonplaceholder.typicode.com/users",
    success: function(data) {
      resolve(data);
    }
  });
});
var likeslist, users, comments, posts;
Promise.all([postd, commd, userd]).then(function(data) {
  if (!localStorage.users) {
    var users = data[2];
    localStorage.setItem("users", JSON.stringify(users));
  } else {
    var users = JSON.parse(localStorage.getItem("users"));
  }
  if (!localStorage.posts) {
    var posts = data[0];
    localStorage.setItem("posts", JSON.stringify(posts));
  } else {
    var posts = JSON.parse(localStorage.getItem("posts"));
  }
  if (!localStorage.comments) {
    var comments = data[1];
    localStorage.setItem("comments", JSON.stringify(comments));
  } else {
    var comments = JSON.parse(localStorage.getItem("comments"));
  }
  console.log(posts);
  console.log(comments);
  console.log(users);

  if (!localStorage.likes) {
    var likeslist = [];
    jQuery.each(posts, function(i, val) {
      var inlikes = 0;
      var likep = new likes(posts[i].id, inlikes);
      likeslist.push(likep);
    });
    console.log;
    localStorage.setItem("likes", JSON.stringify(likeslist));
  } else {
    likeslist = JSON.parse(localStorage.getItem("likes"));
  }

  jQuery(document).ready(function() {
    console.log("doc ready");
    jQuery("#posted").click(function() {
      console.log("enetred posted");
      var uid = parseInt(jQuery("#userid").val());
      var head = jQuery("#posthead").val();
      var post_body = jQuery("#post_body").val();
      function post(userId, id, title, body) {
        this.userId = userId;
        this.id = id;
        this.title = title;
        this.body = body;
      }
      var p_len = posts.length;
      var idnew = posts[p_len - 1].id + 1;
      var post = new post(uid, idnew, head, post_body);
      posts.push(post);
      localStorage.setItem("posts", JSON.stringify(posts));
      var likenp = new likes(idnew, 0);
      console.log(idnew);
      likeslist.push(likenp);
      localStorage.setItem("likes", JSON.stringify(likeslist));
      if (p_len > 20) {
        var nhideclass = "card hideme";
      } else {
        var nhideclass = "card";
      }
      new_post = `<div id="post${idnew}" class="${nhideclass}">
      User:${users[uid - 1].name}
      <div class="card-head">${head}</div>
      <div class="card-body">${post_body}</div>
      <button onclick="addLikes(${idnew})"><i class="fa fa-heart" aria-hidden="true"></i></button><span id="likesno${idnew}">${likeslist[
        p_len
      ].like}</span>
      <button class="btn btn-sm btn-primary comments" onclick="displayComments(${idnew})">Comments</button>
      <button class="btn btn-sm btn-primary comments" onclick="deletePosts(${idnew})">Delete</button>
      <div id="commsec${idnew}"></div>`;
      jQuery("#posts").append(new_post);
      alert("post created successfully");
    });

    displayPosts();
    $(window).scroll(function() {
      $(".hideme").each(function(i) {
        var bottom_of_object = $(this).offset().top + $(this).outerHeight();
        var bottom_of_window = $(window).scrollTop() + $(window).height();

        if (bottom_of_window > bottom_of_object) {
          $(this).animate({ opacity: "1" }, 500);
        }
      });
    });
  });
  // Displaying posts
  function displayPosts() {
    console.log("display potst");
    var posts_display = " ";
    var post_class;
    var uname;
    var llikes;
    console.log(posts);
    jQuery.each(posts, function(i, item) {
      console.log("entered posting");
      console.log(posts[i].id);
      if (i > 19) {
        var hideclass = "card hideme";
      } else {
        var hideclass = "card";
      }
      posts_display +=
        '<div id= "post' + posts[i].id + '" class="' + hideclass + '">';
      jQuery(users).each(function(u, val) {
        if (users[u].id == posts[i].userId) {
          uname = users[u].name;
        }
      });
      posts_display += "User:" + uname;
      posts_display += '<div class="card-head">' + posts[i].title + "</div>";
      posts_display += '<div class="card-body">' + posts[i].body + "</div>";
      posts_display +=
        '<button onclick="addLikes(' +
        posts[i].id +
        ')"><i class="fa fa-heart" aria-hidden="true"></i></button><span id="likesno' +
        posts[i].id +
        '">';
      jQuery(likeslist).each(function(x, val) {
        if (posts[i].id == likeslist[x].postid) {
          llikes = likeslist[x].like;
        }
      });
      posts_display +=
        llikes +
        '</span><br><button class="btn btn-sm btn-primary comments' +
        posts[i].id +
        '" onclick="displayComments(' +
        posts[i].id +
        ')">Comments</button>';
      posts_display +=
        '<button class="btn btn-sm btn-primary comments" onclick="deletePosts(' +
        posts[i].id +
        ')">Delete</button><div id="commsec' +
        posts[i].id +
        '"></div>';
      posts_display += "</div>";
    });
    jQuery("#posts").html(posts_display);
  }
});

// Adding likes

function addLikes(pid) {
  console.log("like");
  likeslist = JSON.parse(localStorage.getItem("likes"));
  jQuery.each(likeslist, function(l, val) {
    console.log(likeslist[l]);
    var d;
    if (likeslist[l].postid == pid) {
      x = likeslist[l].like;
      likeslist[l].like = x + 1;
      d = likeslist[l].like;
    }
    localStorage.setItem("likes", JSON.stringify(likeslist));
    var likeid = "#likesno" + pid;
    jQuery(likeid).html(d);
  });
}
// Deleteing comments
function deleteComments(cid, pid) {
  console.log(cid, pid);
  comments = JSON.parse(localStorage.getItem("comments"));
  var cmntIndex = 0;
  jQuery.each(comments, function(c, item) {
    console.log('eter');
    if (comments[c].id == cid) {
      cmntIndex = c;
    }
  });
  comments.splice(cmntIndex, 1);
  console.log(comments);
  //console.log(comments);
  localStorage.setItem("comments", JSON.stringify(comments));
  var child = "#comm" + cid;
  var parent = "#post" + pid;
  jQuery(parent)
    .find(child)
    .remove();
}
//Adding Comments

function addComments(pid) {
  comments = JSON.parse(localStorage.getItem("comments"));
  var post_box_id = "#newcom" + pid;
  var new_com = jQuery(post_box_id).val();
  var newcomment = new comment(
    pid,
    comments[comments.length - 1].id + 1,
    "newcom",
    "newcomment@gmail.com",
    new_com
  );
  comments.push(newcomment);
  localStorage.setItem("comments", JSON.stringify(comments));
  var neweachcomment =
    "<p class='comms' id='comm" +
    comments.length +
    "'>" +
    new_com +
    "<button onclick='deleteComments(" +
    comments.length +
    "," +
    pid +
    ")'>Delete</button></p>";
  var commentpar_section = "#newcom" + pid;
  jQuery(commentpar_section).before(neweachcomment);
}

//Displaying Comments

function displayComments(pid) {
  setTimeout(function() {
    var eachcomment = "";
    comments = JSON.parse(localStorage.getItem("comments"));
    jQuery.each(comments, function(p, items) {
      if (comments[p].postId == pid) {
        eachcomment +=
          "<p class='comms' id='comm" +
          comments[p].id +
          "'>" +
          comments[p].body +
          "<button onclick='deleteComments(" +
          comments[p].id +
          "," +
          pid +
          ")'>Delete</button></p>";
      }
    });
    eachcomment +=
      "<input type='text' id='newcom" +
      pid +
      "'> <button onclick='addComments(" +
      pid +
      ")'>Add</button>";
    var comment_section = "#commsec" + pid;
    jQuery(comment_section).html(eachcomment);
  }, 0);
}

//Deleteing posts

function deletePosts(pid) {
  var m, o;
  var n = [];
  posts = JSON.parse(localStorage.getItem("posts"));
  comments = JSON.parse(localStorage.getItem("comments"));
  likeslist = JSON.parse(localStorage.getItem("likes"));
  jQuery.each(posts, function(p, val) {
    console.log("entered post");
    console.log(typeof posts[p].id);
    if (posts[p].id === pid) {
      m = p;
    }
  });
  posts.splice(m, 1);
  localStorage.setItem("posts", JSON.stringify(posts));
  jQuery.each(comments, function(c, item) {
    console.log("entered comm");
    if (comments[c].postId == pid) {
      n.push(c);
    }
  });
  for (var i = n.length - 1; i >= 0; i--) {
    comments.splice(n[i], 1);
  }

  localStorage.setItem("comments", JSON.stringify(comments));
  jQuery.each(likeslist, function(l, item) {
    console.log("entered like");
    var z = likeslist[l].postid;
    if (z == pid) {
      o = l;
    }
  });
  likeslist.splice(o, 1);
  localStorage.setItem("likes", JSON.stringify(likeslist));
  var child_p = "#post" + pid;
  var parent_p = "#posts";
  jQuery(parent_p)
    .find(child_p)
    .remove();
}
//Adding new post
