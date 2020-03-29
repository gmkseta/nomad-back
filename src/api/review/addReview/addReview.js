import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middleware";


function calculateAverage(prevAvg, count, newRate, status="update", prevRate=0){
  prevAvg = prevAvg || 0;
  if (status == "update"){
    const sum = prevAvg * (count);
    console.log(sum)
    return (sum - prevRate + newRate)/count;
  } else {
    // status == "create"
    const sum = prevAvg * (count - 1);
    return (sum + newRate) / count;
  }
}

export default {
  // book average 갱신 (create, update)
  // user review 개수 갱신(create)
  Mutation: {
    addReview: async (_, {bookId, content, rate}, { request }) => {
      isAuthenticated(request);
      const {user} = request;
      const review = await prisma.$exists.review({ user: { id: user.id }, book: { id: bookId } });
      try {
        if (review) {
          const targetReview = await prisma.reviews({where: {book: {id: bookId}, user: {id: user.id}}, last: 1 })
          console.log(targetReview[0])
          console.log(bookId)
          const review = await prisma.updateReview({
            data: { rate: rate, content: content },
            where: { id: targetReview[0].id }
          });
          const prevRate = review.rate;

          const reviewCount = await prisma
            .reviewsConnection({ where: { book: { id: bookId } } })
            .aggregate()
            .count();

          const book = await prisma.book({id: bookId});
          
          const newReviewAverage = calculateAverage(book.review_average, reviewCount, rate, "update", prevRate);
          
          await prisma.updateBook({
            where: { id: bookId },
            data: { review_average: newReviewAverage }
          })

          return { review, reviewCount }

        } else {
          const review = await prisma.createReview({
              rate: rate,
              content: content,
              user: {
                connect: {
                  id: user.id
                }
              },
              book: {
                connect: {
                  id: bookId
                }
              
            }
          });
          const tmp = user.count || 0;

          await prisma.updateUser({
            where: {id: user.id},
            data: {reviewsCount: tmp + 1}
          });

          const book = await prisma.book({id: bookId});

          
          
          const reviewCount = await prisma
            .reviewsConnection({ where: { user: { id: user.id }, book: {id: bookId} } })
            .aggregate()
            .count();

          const newReviewAverage = calculateAverage(book.review_average, reviewCount, rate);

          await prisma.updateBook({
            where: { id: bookId },
            data: {review_average: newReviewAverage}
          })
          console.log(`count : ${reviewCount}`)
          return { review, reviewCount };

        }

      } catch (e) {
        throw Error(e.message);
      }
   

    }
  }
}