"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const { Transaction, User, Equipment, InventorySize, Inventory } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const transactionRouter = express.Router();

//Get /api/v#/sports
//Create new sport
transactionRouter.get(
  "/current",
  auth(),
  queryParams([], ["returned", "createdBegin", "createdEnd"]),
  async (req, res, next) => {
    try {
      let user = await User.findOne({
        where: {
          credentialId: req.user.id
        }
      });
      res.json({
        issuedBy: await getTransactions(req.user, {
          issuedBy: user.id,
          returned: req.query.returned,
          createdBegin: req.query.createdBegin,
          createdEnd: req.query.createdEnd
        }),
        issuedTo: await getTransactions(req.user, {
          issuedTo: user.id,
          returned: req.query.returned,
          createdBegin: req.query.createdBegin,
          createdEnd: req.query.createdEnd
        })
      });
    } catch (err) {
      next(err);
    }
  }
);

async function getTransactions(user, { page, limit, issuedBy, issuedTo, returned, createdBegin, createdEnd = new Date() }) {
  try {
    const offset = page * limit || 0;
    const pageLimit = limit || 200;
    let transactions = await Transaction.findAll({
      offset,
      limit: pageLimit,
      where: Sequelize.and(
        { organizationId: user.organizationId },
        issuedBy && { issuedBy },
        issuedTo && { issuedTo },
        returned && { returned },
        createdBegin && { createdAt: { [Sequelize.Op.gte]: createdBegin }},
        { createdAt: { [Sequelize.Op.lte]: createdEnd }}
      ),
      attributes: {
        exclude: ["equipmentId", "issuedBy", "issuedTo", "organizationId"]
      },
      include: [
        {
          model: User,
          as: "IssuedBy",
          attributes: ["id", "firstName", "lastName", "fullName"]
        },
        {
          model: User,
          as: "IssuedTo",
          attributes: ["id", "firstName", "lastName", "fullName"]
        },
        {
          model: Equipment,
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "inventorySizeId", "organizationId"]
          },
          include: [
            {
              model: InventorySize,
              attributes: {
                exclude: ["createdAt", "updatedAt", "inventoryId"]
              },
              include: [
                {
                  model: Inventory,
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "organizationId"]
                  }
                }
              ]
            }
          ]
        }
      ]
    });
    return transactions;
  } catch (err) {
    throw err;
  }
}

module.exports = transactionRouter;
