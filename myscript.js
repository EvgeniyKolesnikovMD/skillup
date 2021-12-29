
const fetchData = async (url) => {
    const data = await fetch(url)
        .then(resp => resp.json())
    return data
}
// ===================================================================================================

const getUsers = async () => {
    const users = await fetchData('MDJS-1817/users_followers_1k_int_id.json')

    getMostPopularUser(users)
    getAmountFriends(users)
}

getUsers()

const getMostPopularUser = (users) => {
    const mostPopularUser =  users.map(item => ({_id: item._id, countFollowers: item.follows.length}))
        .sort((a, b) => a.countFollowers - b.countFollowers)
        .reverse()[0]
    return mostPopularUser
}
const getAmountFriends = (users) => {
    let followers = 0
    let mostFriendshipUser = {follows: 0, id: 0}

    users.forEach((each) => {
        users.forEach((item, index )=> {
            if(item.follows.includes(each._id)) {
                followers = followers + 1
            }
            if(users.length === index + 1){
                if(followers > mostFriendshipUser.follows){
                    mostFriendshipUser.follows = followers
                    mostFriendshipUser.id = each._id
                }
                followers = 0
            }
        })
    })
    // second solution

    const getFollows = users.map(item => item.follows).flat()
    return  mostFrequent(getFollows)
}

//=====================================================================================================

const getPosts = async () => {
    const posts = await fetchData('MDJS-1817/posts_3k_on_10k_users.json')
    getMostActiveAuthor(posts)
    getFavoriteDayOfWeek(posts)
}

getPosts()


const getMostActiveAuthor = (posts) => {
    const getAuthorsId = posts.map(item => item.author_id)

    return posts.find(item => item.author_id === mostFrequent(getAuthorsId))
}


const getFavoriteDayOfWeek = (posts) => {
    const mappingMonth= {
        April: '04',
        August: '08',
        December: '12',
        February: '02',
        July: '07',
        March: '03',
        May: '05',
        June: '06',
        November: '11',
        September: '09',
        October: '10',
        January: '01'
    }

    const daysOfWeekUsedForPosts = []
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    posts.map(item => {
        const dateTransform = item.date.split(' ')

        let date = new Date(dateTransform[2], mappingMonth[dateTransform[1]], dateTransform[0])

        daysOfWeekUsedForPosts.push(date.getDay())
    })

    return dayOfWeek[mostFrequent(daysOfWeekUsedForPosts)]
}

//=====================================================================================================

const getComments = async () => {
    const comments = await fetchData('MDJS-1817/comments_50k_on_30k_posts_10k_users.json')
    getMostActiveCommenter(comments)
    getBiggestAmountDirectChildren(comments)

}
getComments()

const getMostActiveCommenter = (comments) => {
 return  comments.find(item => item.author_id === mostFrequent(comments.map(item => item.author_id)))
}

const getBiggestAmountDirectChildren = (comments) => {
   return  mostFrequent(comments.map(item => item.parent_id).filter(Boolean))
}

//=========================================================================================================

function mostFrequent(arr)
{
    const arrLength = arr.length
    arr.sort();


    let maxCount = 1;
    let res = arr[0];
    let currentCount = 1;

    for (let i = 1; i < arrLength; i++) {

        if (arr[i] === arr[i - 1])
            currentCount++;
        else
        {
            if (currentCount > maxCount)
            {
                maxCount = currentCount;
                res = arr[i - 1];
            }
            currentCount = 1;
        }
    }

    if (currentCount > maxCount)
    {
        maxCount = currentCount;
        res = arr[arrLength - 1];
    }


    return res;
}


