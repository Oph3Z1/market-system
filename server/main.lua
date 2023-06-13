local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent("bo-market-server:additem", function (data)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player then
        if Player.Functions.GetMoney(data.neresi) >= data.totalprice then
            Player.Functions.AddItem(data.itemname, data.tiklandi)
            Player.Functions.RemoveMoney(data.neresi, data.totalprice, "market-satınalma")
        end
    end
end)