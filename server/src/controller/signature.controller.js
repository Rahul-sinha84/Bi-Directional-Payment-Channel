import Signature from "../db/schema.js";

const returnFunc = (data, res, message) =>
  res.status(200).json({
    data,
    status: res.statusCode,
    message,
  });

const returnErr = (err, res) => {
  console.log(err);
  return res.status(500).json({
    status: res.statusCode,
    message: err.message,
  });
};

const controllers = {
  createSignature: async (req, res) => {
    try {
      const {
        contractAddress,
        acc1bal,
        acc2bal,
        acc1signature,
        acc2signature,
      } = req.body;
      const data = {
        contractAddress,
        isCompleted: false,
        acc1bal,
        acc2bal,
        acc1signature,
        acc2signature,
        declined: false,
      };
      await Signature.create(data)
        .then((response) => returnFunc({}, res, "Successfully Created !!"))
        .catch((err) => returnErr(err, res));
    } catch (err) {
      returnErr(err, res);
    }
  },
  getSignatures: async (req, res) => {
    try {
      const { contractAddress } = req.params;
      await Signature.find({ contractAddress })
        .sort({ createAt: -1 })
        .exec()
        .then((response) =>
          returnFunc(response, res, "Successfully data reterieved !!")
        )
        .catch((err) => returnErr(err, res));
    } catch (err) {
      returnErr(err, res);
    }
  },
  signSignature: async (req, res) => {
    try {
      const { _id, acc1signature, acc2signature } = req.body;

      const signature = await Signature.findById(_id).exec();

      const isCompleted =
        (signature.acc1signature && acc2signature) ||
        (signature.acc2signature && acc1signature)
          ? true
          : false;

      await Signature.findByIdAndUpdate(
        { _id },
        { acc1signature, acc2signature, isCompleted }
      )
        .then((response) => {
          returnFunc({}, res, "Successfully updated signature !!");
        })
        .catch((err) => returnErr(err, res));
    } catch (err) {
      returnErr(err, res);
    }
  },
  declineSignature: async (req, res) => {
    try {
      const { _id } = req.body;
      await Signature.findByIdAndUpdate(_id, { declined: true })
        .then((_res) => returnFunc({}, res, "Declined Successfully !!"))
        .catch((err) => returnErr(err, res));
    } catch (err) {
      returnErr(err);
    }
  },
  contractIntractionSuccess: async (req, res) => {
    try {
      const { _id } = req.body;
      await Signature.findByIdAndUpdate(_id, { contractSuccess: true })
        .then((_res) =>
          returnFunc({}, res, "Contract Interaction set to TRUE !!")
        )
        .catch((err) => returnErr(err));
    } catch (err) {
      returnErr(err);
    }
  },
};

export default controllers;
